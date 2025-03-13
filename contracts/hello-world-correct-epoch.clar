;; hello-world-correct-epoch.clar
;; A minimal hello world contract with epoch 2.0 for testnet deployment

;; Read-only function that returns a greeting
(define-read-only (greet)
  (ok "Hello, Stacks World!"))

;; Public function that returns a greeting with name
(define-public (greet-name (name (string-utf8 50)))
  (ok (concat "Hello, " name "!")))