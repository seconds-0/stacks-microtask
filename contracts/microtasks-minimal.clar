;; microtasks-minimal.clar
;; A simplified microtasks contract for Epoch 2.0 testnet deployment

;; Constants for error handling
(define-constant ERR_NO_FUNDS u1)
(define-constant ERR_TASK_NOT_FOUND u2)
(define-constant ERR_UNAUTHORIZED u3)
(define-constant ERR_ALREADY_CLAIMED u4)
(define-constant ERR_NOT_CLAIMED u5)

;; Data map to store tasks
(define-map tasks
  { task-id: uint }
  {
    description: (string-utf8 256),
    reward: uint,
    poster: principal,
    status: (string-ascii 10),
    claimer: (optional principal)
  }
)

;; Variable to track the number of tasks
(define-data-var task-counter uint u0)

;; Public functions

;; Post a new task with a description and reward
(define-public (post-task (description (string-utf8 256)) (reward uint))
  (let ((task-id (var-get task-counter)))
    (if (>= (stx-get-balance tx-sender) reward)
      (begin
        (map-insert tasks { task-id: task-id }
          {
            description: description,
            reward: reward,
            poster: tx-sender,
            status: "open",
            claimer: none
          }
        )
        (var-set task-counter (+ task-id u1))
        (ok task-id)
      )
      (err ERR_NO_FUNDS)
    )
  )
)

;; Claim an open task
(define-public (claim-task (task-id uint))
  (let ((task (map-get? tasks { task-id: task-id })))
    (match task
      task-data
      (if (is-eq (get status task-data) "open")
        (begin
          (map-set tasks { task-id: task-id }
            (merge task-data { 
              claimer: (some tx-sender), 
              status: "claimed" 
            })
          )
          (ok true)
        )
        (err ERR_ALREADY_CLAIMED)
      )
      (err ERR_TASK_NOT_FOUND)
    )
  )
)

;; Approve a claimed task and transfer the reward
(define-public (approve-task (task-id uint))
  (let ((task (map-get? tasks { task-id: task-id })))
    (match task
      task-data
      (if (and (is-eq tx-sender (get poster task-data))
               (is-eq (get status task-data) "claimed"))
        (let ((claimer (unwrap! (get claimer task-data) (err ERR_NOT_CLAIMED))))
          (try! (stx-transfer? (get reward task-data) tx-sender claimer))
          (map-set tasks { task-id: task-id }
            (merge task-data { status: "completed" })
          )
          (ok true)
        )
        (err ERR_UNAUTHORIZED)
      )
      (err ERR_TASK_NOT_FOUND)
    )
  )
)

;; Read-only functions

;; Get details of a specific task
(define-read-only (get-task (task-id uint))
  (map-get? tasks { task-id: task-id })
)