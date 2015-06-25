(function(viewport) {

    var container = document.querySelector('table'),
        isTable = container.tagName.toLowerCase() === 'table',
        isHeaderSticky = false, // TODO: Initialize these from passed in variables
        isFooterSticky = true,
        wrapper, footer, header;

        // For dev only
        log = console.log.bind(console);

    function _createHooterWrapper(isFooter) {
        var hooterWrapper = document.createElement('div');

        hooterWrapper.classList.add('sticky-hooters_sticky-wrapper');
        hooterWrapper.classList.add('sticky-hooters_sticky-' + (isFooter ? 'footer' : 'header'));
        hooterWrapper.style.display = 'none';

        return hooterWrapper;
    }

    function _createWrapper() {
        var containerWrapper = document.createElement('div');

        // Decorate container wrapper
        containerWrapper.classList.add('sticky-hooters_wrapper');

        // Add container wrapper to DOM
        container.parentNode.insertBefore(containerWrapper, container);

        // Decorate container and append to container wrapper
        //container.classList.add('sticky-hooters_content');
        containerWrapper.appendChild(container);

        // Store reference to wrapper
        wrapper = containerWrapper;

        return containerWrapper;
    }

    function _makeSticky(options) {
        if (!options || !options.position || !options.stickyElement || !options.stickyElement.nodeType || options.stickyElement.nodeType !== 1) {
            throwOptionsException();
        }

        var isFooter = options.position === 'bottom',
            stickyClone = options.stickyElement.cloneNode(true),
            stickyParent = options.stickyElement.parentNode,
            containerWrapper = !wrapper ? _createWrapper() : wrapper,
            hooterWrapper = _createHooterWrapper(isFooter),
            table;

        _storeHooter(isFooter, options.stickyElement);

        if (isTable) {
            // TODO: Implement `let table` here
            table = document.createElement('table');
            table.setAttribute('class', stickyParent.getAttribute('class'));
            table.style.width = stickyParent.getBoundingClientRect().width + 'px';
            table.appendChild(stickyClone);

            hooterWrapper.appendChild(table);
        } else {
            hooterWrapper.appendChild(stickyClone);
        }

        if (isFooter) {
            footer.stickyClone = hooterWrapper;
            containerWrapper.appendChild(hooterWrapper);
        } else {
            header.stickyClone = hooterWrapper;
            containerWrapper.insertBefore(hooterWrapper, container);
        }
    }

    function _storeHooter(isFooter, stickyElement) {
        if (isFooter) {
            footer = stickyElement;
        } else {
            header = stickyElement;
        }
    }

    /**
     * Covers your sticky-buns by throwing an exception if you forget
     * to pass the required option values.
     *
     * @method throwOptionsException
     */
    function throwOptionsException() {
        throw new ReferenceError(
            'You must pass an options object to ' + throwOptionsException.caller.name + '().'
        );
    }

    function stick(elem) {
        elem.isStuck = true;
        elem.style.visibility = 'hidden';
        elem.stickyClone.style.display = 'block';
    }

    function unstick(elem) {
        elem.isStuck = false;
        elem.style.visibility = 'visible';
        elem.stickyClone.style.display = 'none';
    }

    function watchHooters() {
        var footerDOMRect = footer ? footer.getBoundingClientRect() : null,
            headerDOMRect = header ? header.getBoundingClientRect() : null,
            footOffset = container.getBoundingClientRect().bottom, //footerDOMRect.top,
            headOffset = headerDOMRect ? headerDOMRect.top : null,
            viewportHeight = viewport.innerHeight;

        // Watch footer
        if (isFooterSticky) {
            if (footer.isStuck) {
                if (footOffset <= viewportHeight - footerDOMRect.height) {
                    unstick(footer);
                }
            } else {
                if (footOffset > viewportHeight - footerDOMRect.height) {
                    stick(footer);
                }
            }
        }

        // Watch header
        if (isHeaderSticky) {
            if (header.isStuck) {
                if (headOffset > 0 || footOffset < headerDOMRect.height) {
                    unstick(header);
                }
            } else {
                if (headOffset <= 0 && footOffset > headerDOMRect.height) {
                    stick(header);
                }
            }
        }
    }

    function init() {
        if (isHeaderSticky) {
            _makeSticky({
                position: 'top',
                stickyElement: container.querySelector('thead')
            });
        }

        if (isFooterSticky) {
            _makeSticky({
                position: 'bottom',
                stickyElement: container.querySelector('tfoot')
            });
        }

        /*
            Scroll event fires watchHooters() automatically if loaded with positive
            vertical scroll. Otherwise call watchHooters() manually to stick footer.
        */
        //if (!window.scrollY && isFooterSticky) {
            watchHooters();
        //}
    }

    viewport.addEventListener('DOMContentLoaded', init);
    viewport.addEventListener('scroll', $.throttle(100, watchHooters));

}(window));
