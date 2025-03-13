;; microtasks contract
;; A simple decentralized micro-task bounty board

;; Error codes
(define-constant ERR_INSUFFICIENT_FUNDS (err u101))
(define-constant ERR_TASK_NOT_FOUND (err u102))
(define-constant ERR_TASK_ALREADY_CLAIMED (err u103))
(define-constant ERR_TASK_COMPLETED (err u104))
(define-constant ERR_NOT_AUTHORIZED (err u105))
(define-constant ERR_TASK_NOT_CLAIMED (err u106))

;; Data variables
(define-data-var next-task-id uint u0)

;; Data maps
(define-map tasks 
    { task-id: uint, poster: principal }
    { description: (string-utf8 256),
      reward: uint,
      claimer: (optional principal),
      completed: bool,
      status: (string-ascii 10) }
)

;; Read only functions
(define-read-only (get-task (task-id uint) (poster principal))
    (map-get? tasks { task-id: task-id, poster: poster })
)

(define-read-only (get-all-tasks)
    ;; This is a simplified way to get all tasks. In practice, we'd need pagination.
    ;; For a PoC, we'll return a limited number of tasks.
    (let ((current-id (var-get next-task-id)))
        (filter
            is-not-none
            (map
                get-task-by-id
                (get-task-ids current-id)
            )
        )
    )
)

(define-read-only (get-task-ids (current-id uint))
    ;; Helper function to generate a list of task IDs from 0 to current-id - 1
    ;; Limited to the most recent 20 tasks for simplicity in this PoC
    (let ((max-display u20)
          (start-id (if (> current-id max-display) (- current-id max-display) u0)))
        (map
            uint-to-task-id
            (list-range start-id current-id)
        )
    )
)

(define-read-only (uint-to-task-id (id uint))
    ;; Transformation helper
    id
)

(define-read-only (list-range (start uint) (end uint))
    ;; Helper to create a list of consecutive integers
    (if (>= start end)
        (list)
        (append (list start) (list-range (+ start u1) end))
    )
)

(define-read-only (get-task-by-id (task-id uint))
    ;; Attempt to find a task by its ID across all posters
    ;; This is inefficient but works for a PoC with limited data
    ;; Returns none if not found
    (let ((sender tx-sender))
        (map-get? tasks { task-id: task-id, poster: sender })
    )
)

(define-read-only (is-not-none (item (optional (tuple (description (string-utf8 256)) (reward uint) (claimer (optional principal)) (completed bool) (status (string-ascii 10))))))
    ;; Filter helper
    (is-some item)
)

;; Public functions
(define-public (post-task (description (string-utf8 256)) (reward uint))
    (let ((sender tx-sender)
          (current-id (var-get next-task-id)))
        (asserts! (>= (stx-get-balance sender) reward) ERR_INSUFFICIENT_FUNDS)
        (try! (stx-transfer? reward sender (as-contract tx-sender)))
        (try! (map-insert tasks 
            { task-id: current-id, poster: sender }
            { description: description,
              reward: reward,
              claimer: none,
              completed: false,
              status: "open" }))
        (var-set next-task-id (+ current-id u1))
        (ok current-id)
    )
)

(define-public (claim-task (task-id uint) (poster principal))
    (let ((sender tx-sender)
          (task-data (unwrap! (get-task task-id poster) ERR_TASK_NOT_FOUND)))
        
        ;; Check if task is already claimed or completed
        (asserts! (not (get completed task-data)) ERR_TASK_COMPLETED)
        (asserts! (is-none (get claimer task-data)) ERR_TASK_ALREADY_CLAIMED)
        
        ;; Update task with claimer
        (try! (map-set tasks 
            { task-id: task-id, poster: poster }
            (merge task-data { 
              claimer: (some sender),
              status: "claimed" 
            })))
            
        (ok true)
    )
)

(define-public (approve-task (task-id uint))
    (let ((sender tx-sender)
          (task-data (unwrap! (get-task task-id sender) ERR_TASK_NOT_FOUND)))
        
        ;; Check task exists and is claimed but not completed
        (asserts! (not (get completed task-data)) ERR_TASK_COMPLETED)
        (let ((claimer-opt (get claimer task-data)))
            (asserts! (is-some claimer-opt) ERR_TASK_NOT_CLAIMED)
            
            ;; Get claimer and reward amount
            (let ((claimer (unwrap! claimer-opt ERR_TASK_NOT_CLAIMED))
                  (reward (get reward task-data)))
                
                ;; Transfer reward to claimer from contract
                (try! (as-contract (stx-transfer? reward tx-sender claimer)))
                
                ;; Update task as completed
                (try! (map-set tasks 
                    { task-id: task-id, poster: sender }
                    (merge task-data { 
                      completed: true,
                      status: "completed"
                    })))
                    
                (ok true)
            )
        )
    )
) 