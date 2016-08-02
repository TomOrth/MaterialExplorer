[].slice.call(document.querySelectorAll('.paper-button')).forEach(function(el) {
        el.PaperRipple = new PaperRipple();
        el.appendChild(el.PaperRipple.$);

        el.addEventListener('mousedown', function(ev) {
            this.PaperRipple.downAction(ev);
        });

        el.addEventListener('mouseup', function() {
            this.PaperRipple.upAction();
        });
    });
