/**
 * Provides sticky-header and sticky-footer features for primary
 * content tables.
 *
 * @module sticky-hooters
 */
(function() {
    var table = document.querySelector('.sticky-hooters-table'),
        thead = table.querySelector('thead'),
        tfoot = table.querySelector('tfoot'),
        headerHeight, footerHeight;

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

    /**
     * Covers your sticky-buns by throwing an exception if you forget
     * to pass the required HTMLElements.
     *
     * @method throwElementException
     */
    function throwElementException() {
        throw new ReferenceError(
            'You must pass an HTMLElement to ' + throwElementException.caller.name + '().'
        );
    }

    /**
     * Apply "fixed" class to table-group and set flag.
     *
     * @method stick
     * @requires {HTMLElement} table-group element to affix.
     */
    function stick(elem) {
        if (!elem || !elem.tagName) {
            throwElementException();
        }
        elem.classList.add('fixed');
        elem.isFixed = true;
    }

    /**
     * Remove "fixed" class and reset flag.
     *
     * @method unstick
     * @requires {HTMLElement} table-group element to detach.
     */
    function unstick(elem) {
        if (!elem || !elem.tagName) {
            throwElementException();
        }
        elem.classList.remove('fixed');
        elem.isFixed = false;
    }

    /**
     * Wraps cell contents with sticky-hooters container.
     *
     * @method wrapChildren
     * @requires {Object} Options for cell-type being initialized.
     *     {
     *         groupElm: element, // {HTMLElement} (thead/tfoot)
     *         groupCell: "tag" // {String} (th/td)
     *     }
     */
    function wrapChildren(cell) {
        if (this.constructor.name.toLowerCase() === 'window') {
            throwOptionsException();
        }

        // Create wrapper DIV, add sticky-hooters class, set width and add children
        var innerDiv = document.createElement('div');
        innerDiv.classList.add('sticky-hooters-' + this.groupCell + '-inner');
        innerDiv.style.width = cell.offsetWidth + 'px';
        innerDiv.innerHTML = cell.innerHTML;

        // Set cell heights so they don't collapse when inner DIVs are removed from flow
        cell.style.height = this.groupElm.getBoundingClientRect().height + 'px';

        // Replace cell content with wrapped content
        cell.innerHTML = innerDiv.outerHTML;
    }

    /**
     * Updates DOM to support sticky-hooters and stores header and
     * footer heights for later reference. Also initializes footer
     * as a fixed element.
     *
     * @method setupStickyRow
     * @requires {Object} Options for cell-type being initialized.
     *     {
     *         groupElm: element, // {HTMLElement} (thead/tfoot)
     *         groupCell: "tag" // {String} (th/td)
     *     }
     */
    function setupStickyRow(options) {
        if (!options || !options.groupElm || !options.groupCell) {
            throwOptionsException();
        }

        var groupElm = options.groupElm,
            rowTagName = groupElm.tagName.toLowerCase(),
            stickyCells = [].slice.call(groupElm.querySelectorAll(options.groupCell));

        stickyCells.forEach(wrapChildren, options);

        // Now that DOM has been updated, set heights and stick (where desired)
        switch (rowTagName) {
            case 'thead':
                headerHeight = groupElm.getBoundingClientRect().height;
                break;
            case 'tfoot':
                footerHeight = groupElm.getBoundingClientRect().height;

                // TODO: Only do this for the first table
                stick(tfoot);
                break;
        }
    }

    /**
     * Updates sticky-hooters header and footer.
     *
     * @event scroll
     */
    function watchHooters() {
        var theadOffset = thead.getBoundingClientRect().top,
            tfootOffset = tfoot.getBoundingClientRect().top;

        // Watch header
        if (thead.isFixed) {
            if (theadOffset > 0 || tfootOffset < headerHeight) {
                unstick(thead);
            }
        } else {
            if (theadOffset <= 0 && tfootOffset > headerHeight) {
                stick(thead);
            }
        }

        // Watch footer
        if (tfoot.isFixed) {
            if (tfootOffset <= window.innerHeight - footerHeight) {
                unstick(tfoot);
            }
        } else {
            if (tfootOffset > window.innerHeight - footerHeight) {
                stick(tfoot);
            }
        }

    }

    /**
     * Initializes sticky-hooters.
     *
     * @event DOMContentLoaded
     */
    function init() {
        // Setup header
        setupStickyRow({
            groupElm: thead,
            groupCell: 'th'
        });

        // Setup footer
        setupStickyRow({
            groupElm: tfoot,
            groupCell: 'td'
        });
    }

    window.addEventListener('DOMContentLoaded', init);
    window.addEventListener('scroll', watchHooters);

}(window));
