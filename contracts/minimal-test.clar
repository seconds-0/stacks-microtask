;; minimal-test.clar
;; An extremely minimal contract for testing Epoch 2.0 deployment

;; Single read-only function
(define-read-only (get-number)
  (ok u42))

;; Single public function
(define-public (add-one (n uint))
  (ok (+ n u1)))