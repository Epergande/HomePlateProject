document.addEventListener('DOMContentLoaded', function () {
    var popoverTriggerList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl, {
            html: true,
            sanitize: false,
            container: popoverTriggerEl.getAttribute('data-bs-container') || 'body',
            trigger: 'click'
        });
    });

    var nextOrder = document.getElementById('orderNextBtn');
    var nextShip = document.getElementById('shippingNextBtn');

    function getModal(el) {
        if (!el) return null;
        return bootstrap.Modal.getOrCreateInstance(el);
    }

    if (nextOrder) {
        nextOrder.addEventListener('click', function () {
            var orderEl = document.getElementById('orderModal');
            var shipEl = document.getElementById('shippingModal');
            if (!orderEl || !shipEl) {
                console.error('Missing order or shipping modal element');
                return;
            }

            var orderModal = getModal(orderEl);
            var shipModal = getModal(shipEl);


            var onHidden = function () {
                shipModal.show();
                orderEl.removeEventListener('hidden.bs.modal', onHidden);
            };
            orderEl.addEventListener('hidden.bs.modal', onHidden);

            orderModal.hide();
        });
    }

    if (nextShip) {
        nextShip.addEventListener('click', function () {
            var shipEl = document.getElementById('shippingModal');
            var paymentEl = document.getElementById('paymentModal');
            if (!shipEl || !paymentEl) {
                console.error('Missing shipping or payment modal element');
                return;
            }

            var shipModal = getModal(shipEl);
            var paymentModal = getModal(paymentEl);

            var onHiddenShip = function () {
                paymentModal.show();
                shipEl.removeEventListener('hidden.bs.modal', onHiddenShip);
            };
            shipEl.addEventListener('hidden.bs.modal', onHiddenShip);

            shipModal.hide();
        });
    }
});
