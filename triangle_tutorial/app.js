// Define the vertex shader source code
// This shader transforms vertex positions and passes vertex color data to the fragment shader
var vertexShaderText = [
    'precision mediump float;',       // Set precision for floating-point calculations
    '',
    'attribute vec2 vertPosition;',  // Input attribute for vertex position (x, y)
    'attribute vec3 vertColor;',     // Input attribute for vertex color (r, g, b)
    'varying vec3 fragColor;',       // Output variable to pass color to the fragment shader
    '',
    'void main()',                   // Main function
    '{',
    '  fragColor = vertColor;',      // Pass vertex color to fragment shader
    '  gl_Position = vec4(vertPosition, 0.0, 1.0);', // Transform position to clip space
    '}'
].join('\n');                        // Join the lines into a single string

// Define the fragment shader source code
// This shader computes the color of each fragment (pixel)
var fragmentShaderText = [
    'precision mediump float;',      // Set precision for floating-point calculations
    '',
    'varying vec3 fragColor;',       // Input variable for interpolated color from vertex shader
    'void main()',                   // Main function
    '{',
    '  gl_FragColor = vec4(fragColor, 1.0);', // Set the fragment's color (with alpha = 1.0)
    '}'
].join('\n');                        // Join the lines into a single string

// Main initialization function
var InitDemo = function () {
    console.log('This is working');

    // Get the canvas element and WebGL rendering context
    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    // Fallback to experimental WebGL if standard WebGL is not supported
    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    // Notify the user if WebGL is not available
    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    // Set the clear color (background color) and clear the canvas
    gl.clearColor(0.75, 0.85, 0.8, 1.0); // Light blue background
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers

    //
    // Create and compile shaders
    //

    // Create a vertex shader and attach the source code
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);

    // Compile the vertex shader
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    // Create a fragment shader and attach the source code
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    // Compile the fragment shader
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Create a WebGL program and link the compiled shaders
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    // Validate the program (optional)
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Define the geometry (triangle vertices) and create a buffer
    //

    var triangleVertices = [
        // Vertex positions (x, y) followed by color data (r, g, b)
        0.0, 0.5,    1.0, 1.0, 0.0,  // Vertex 1: Top-center, yellow
        -0.5, -0.5,  0.7, 0.0, 1.0,  // Vertex 2: Bottom-left, purple
        0.5, -0.5,   0.1, 1.0, 0.6   // Vertex 3: Bottom-right, teal
    ];

    // Create a buffer and bind it as the active buffer
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);

    // Upload the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    //
    // Link vertex data to shader attributes
    //

    // Get the locations of shader attributes
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    // Configure the position attribute
    gl.vertexAttribPointer(
        positionAttribLocation,          // Attribute location
        2,                               // Number of components (x, y)
        gl.FLOAT,                        // Data type
        gl.FALSE,                        // Normalize
        5 * Float32Array.BYTES_PER_ELEMENT, // Stride (total size of each vertex)
        0                                // Offset (position data starts at index 0)
    );

    // Configure the color attribute
    gl.vertexAttribPointer(
        colorAttribLocation,             // Attribute location
        3,                               // Number of components (r, g, b)
        gl.FLOAT,                        // Data type
        gl.FALSE,                        // Normalize
        5 * Float32Array.BYTES_PER_ELEMENT, // Stride (total size of each vertex)
        2 * Float32Array.BYTES_PER_ELEMENT  // Offset (color data starts after 2 floats)
    );

    // Enable the attributes
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // Main render loop
    //

    // Use the compiled and linked shader program
    gl.useProgram(program);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw 3 vertices as a triangle
};
