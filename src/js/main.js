/*
 * Main
 *
 * Create canvas
 * Add event listener to the canvas to check if a pin is being dragged
 * Create pins
 */

window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // DraggablePinsCanvas Constructor
    var DraggablePinsCanvas = function (element, options) {

        // Vars
        this.element = element;
        this.isDragging = false;
        this.options = options;
        this.pins = [];

        // Run init
        this.init();
    };

    // DraggablePinsCanvas Methods
    DraggablePinsCanvas.prototype.init = function () {

        // Create the image
        this.createImage();

        // Bind the event listeners
        this.bindEventListeners();

        // Loop over all the pins
        for (var i = 0, j = this.options.pins.length; i < j; i++) {

            // Create the pins
            this.addPin(this.options.pins[i]);
        }
    };

    // Create image and place it inside the canvas
    DraggablePinsCanvas.prototype.createImage = function () {

        // Create an image element
        this.image = document.createElement('img');

        // Set the src of the image
        this.image.src = this.options.image;

        // Append the image to the canvas
        this.element.appendChild(this.image);
    };

    // Create pin
    DraggablePinsCanvas.prototype.addPin = function (pinOptions) {

        // Create pin instance
        var pin = new DraggablePin(pinOptions, this);

        // Push the instance to the pins array
        this.pins.push(pin);

        // Append pin to this.element
        this.element.appendChild(pin.element);
    };

    // Element listeners
    DraggablePinsCanvas.prototype.bindEventListeners = function () {

        // Store reference to this
        var _this = this;

        // Someone has clicked inside the canvas
        this.element.addEventListener('mousedown', function (e) {

            // If they clicked a pin
            if (e.target.classList.contains(_this.options.basePinClass)) {

                // Save reference to the pin
                _this.draggingPin = _this.pins[e.target.getAttribute('data-pin-id')];

                // Set the dragging position
                _this.draggingPin.draggingPosition = {
                    'x': e.layerX,
                    'y': e.layerY
                };

                // Set isDragging to true
                _this.isDragging = true;
            }
        });

        // Someone is moving their mouse over the canvas
        this.element.addEventListener('mousemove', function (e) {

            // If they are dragging a pin
            if (_this.isDragging) {

                // Get the current transform
                var currentTransform = _this.draggingPin.element.style.transform.match(/\((-?[0-9]*\.?[0-9]*)(\w+),\s(-?[0-9]*\.?[0-9]*)(\w+),\s(-?[0-9]*\.?[0-9]*)(\w+)\)/);

                // Calculate the new transform
                var newTransform = {
                    'x': Number(currentTransform[1]) + (e.layerX - _this.draggingPin.draggingPosition.x) + currentTransform[2],
                    'y': Number(currentTransform[3]) + (e.layerY - _this.draggingPin.draggingPosition.y) + currentTransform[4]
                };

                // Change the position of the pin
                _this.draggingPin.element.style.transform = 'translate3D(' + newTransform.x + ', ' + newTransform.y + ', 0)';

                // Set the new positions
                _this.draggingPin.draggingPosition = {
                    'x': e.layerX,
                    'y': e.layerY
                };
            }
        });

        // Someone has released the click
        this.element.addEventListener('mouseup', function (e) {

            // User was dragging
            if (_this.isDragging) {

                // Set isDragging to false
                _this.isDragging = false;
            }
        });
    };

    // DraggablePin Constructor
    var DraggablePin = function (pinOptions, canvasInstance) {

        // Store the options
        this.options = pinOptions;

        // Create element
        this.element = document.createElement('div');

        // Add base class
        this.element.classList.add(canvasInstance.options.basePinClass);

        // Add class
        this.element.classList.add(this.options.class);

        // Add pin number
        this.element.innerHTML = this.options.number;

        // Set the ID of the pin
        this.element.setAttribute('data-pin-id', canvasInstance.pins.length);

        // Position pin
        this.element.style.transform = 'translate3D(' + this.options.x + 'px, ' + this.options.y + 'px, 0)';
    };

    // Function to no avoid side effect warnings
    var createDraggablePinsCanvas = function (element, options) {
        return new DraggablePinsCanvas(element, options);
    };

    // DraggablePinsCanvas instance
    var draggablePinsCanvas = createDraggablePinsCanvas(document.querySelector('.draggable-pins-canvas'), {
        'basePinClass': 'pin',
        'image': 'img/demo-image.jpg',
        'pins': [
            {
                'class': 'pink',
                'number': '1',
                'x': '0',
                'y': '0'
            }
        ]
    });

    // Purely for testing purposes
    window.draggablePinsCanvas = draggablePinsCanvas;
});
