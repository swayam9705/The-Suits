export function getCaretCoordinates(element, position) {
    const isBrowser = (typeof window !== 'undefined');
    if (!isBrowser) {
        throw new Error('getCaretCoordinates should only be called in a browser');
    }

    const div = document.createElement('div');
    const style = div.style;
    const computed = window.getComputedStyle(element);

    // Default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (computed.wordWrap !== 'break-word') {
        style.wordWrap = 'break-word';
    } else {
        style.wordWrap = computed.wordWrap;
    }

    // Position off-screen
    style.position = 'absolute';
    style.visibility = 'hidden';

    // Transfer the element's properties to the div
    const properties = [
        'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
        'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust',
        'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent',
        'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
    ];

    properties.forEach(prop => {
        style[prop] = computed[prop];
    });

    const isInput = element.nodeName === 'INPUT';
    if (isInput) {
        style.whiteSpace = 'pre';
    }

    div.textContent = element.value.substring(0, position);
    if (isInput) {
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    }

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    if (isInput) {
        span.textContent = span.textContent.replace(/\s/g, '\u00a0');
    }
    div.appendChild(span);

    document.body.appendChild(div);

    const coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        height: parseInt(computed['lineHeight'])
    };

    if (!isNaN(coordinates.height)) {
        // If lineHeight is 'normal', it will return NaN, fall back to font size
        coordinates.height = parseInt(computed['lineHeight']);
    } else {
        coordinates.height = parseInt(computed['fontSize']) * 1.2;
    }

    document.body.removeChild(div);
    
    // adjust scrolling
    coordinates.top -= element.scrollTop;
    coordinates.left -= element.scrollLeft;

    return coordinates;
}
