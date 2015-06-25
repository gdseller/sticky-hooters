# jQueryStickyHooters
jQuery plugin that dynamically sticks content headers and footers to the top and bottom of viewport.

## Usage
    $("table").stickyHooters({});

    $("table").stickyHooters({
        bottom: '20px',                        // default is '0'
        footerSelector: '.list-footer',        // default is 'tfoot'
        headerSelector: '.list-header',        // default is 'thead'
        top: '60px'                            // default is '0'
    });
