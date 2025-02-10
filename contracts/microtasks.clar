;; microtasks contract
;; A simple decentralized micro-task bounty board

;; Error codes
(define-constant ERR_INSUFFICIENT_FUNDS (err u101))
(define-constant ERR_TASK_NOT_FOUND (err u102))
(define-constant ERR_TASK_ALREADY_CLAIMED (err u103))
(define-constant ERR_TASK_COMPLETED (err u104))
(define-constant ERR_NOT_AUTHORIZED (err u105))

;; Data variables
(define-data-var next-task-id uint u0)

;; Data maps
(define-map tasks 
    { task-id: uint, poster: principal }
    { description: (string-utf8 256),
      reward: uint,
      claimer: (optional principal),
      completed: bool }
)

;; Read only functions
(define-read-only (get-task (task-id uint) (poster principal))
    (map-get? tasks { task-id: task-id, poster: poster })
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
              completed: false }))
        (var-set next-task-id (+ current-id u1))
        (ok current-id)
    )
) 