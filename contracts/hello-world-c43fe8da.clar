;; hello-world-c43fe8da.clar
;; A minimal hello world contract for testnet deployment testing

;; Read-only function that returns a greeting
(define-read-only (greet)
  (ok "Hello, Stacks World!"))

;; Public function that returns a greeting with name
(define-public (greet-name (name (string-utf8 50)))
  (ok (concat "Hello, " name "!")))