var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragTexCoord = vertTexCoord;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'void main()',
'{',
'  gl_FragColor = texture2D(sampler, fragTexCoord);',
'}'
].join('\n');

var InitDemo = function () {
    console.log('This is working');

    var canvas = document.getElementById('texturedcube');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
    }



    //
    // Create shaders
    // 
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    var groundsize = 5.0;

    var boxVertices =
	[ // X, Y, Z           U, V
		//// Top
		//-1.0, 1.0, -1.0, 0, 0,
		//-1.0, 1.0, 1.0, 0, 1,
		//1.0, 1.0, 1.0, 1, 1,
		//1.0, 1.0, -1.0, 1, 0,

		//// Left
		//-1.0, 1.0, 1.0, 0, 0,
		//-1.0, -1.0, 1.0, 1, 0,
		//-1.0, -1.0, -1.0, 1, 1,
		//-1.0, 1.0, -1.0, 0, 1,

		//// Right
		//1.0, 1.0, 1.0, 1, 1,
		//1.0, -1.0, 1.0, 0, 1,
		//1.0, -1.0, -1.0, 0, 0,
		//1.0, 1.0, -1.0, 1, 0,

		//// Front
		//1.0, 1.0, 1.0, 1, 1,
		//1.0, -1.0, 1.0, 1, 0,
		//-1.0, -1.0, 1.0, 0, 0,
		//-1.0, 1.0, 1.0, 0, 1,

		//// Back
		//1.0, 1.0, -1.0, 0, 0,
		//1.0, -1.0, -1.0, 0, 1,
		//-1.0, -1.0, -1.0, 1, 1,
		//-1.0, 1.0, -1.0, 1, 0,

		// Bottom13.65
		-groundsize, -0.2, -groundsize, 1, 1,
		-groundsize, -0.2, groundsize, 1, 0,
		groundsize, -0.2, groundsize, 0, 0,
		groundsize, -0.2, -groundsize, 0, 1,
	];

    var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		//// Left
		//5, 4, 6,
		//6, 4, 7,

		//// Right
		//8, 9, 10,
		//8, 10, 11,

		//// Front
		//13, 12, 14,
		//15, 14, 12,

		//// Back
		//16, 17, 18,
		//16, 18, 19,

		//// Bottom
		//21, 20, 22,
		//22, 20, 23
	];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
    gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    //gl.assetManager.loadTexture("sky.jpg");
    // Create texture
    //
    var boxTexture = gl.createTexture();
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, document.getElementById('crate-image'));
    gl.bindTexture(gl.TEXTURE_2D, null);
    // Tell OpenGL state machine which program should be active.
    gl.useProgram(program);

    
    /* ====== Associating attributes to vertex shader =====*/
    var Pmatrix = gl.getUniformLocation(program, "mProj");
    var Vmatrix = gl.getUniformLocation(program, "mView");
    var Mmatrix = gl.getUniformLocation(program, "mWorld");

    function get_projection(angle, a, zMin, zMax) {
        var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
        return [
           0.5 / ang, 0, 0, 0,
           0, 0.5 * a / ang, 0, 0,
           0, 0, -(zMax + zMin) / (zMax - zMin), -1,
           0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    var proj_matrix = get_projection(40, canvas.width / canvas.height,0.001, 10000000);

    mov_matrix = [1, 0, 0, 0,
                      0, 1, 0, 0,
                      0, 0, 1, 0,
                      0, 0, 0, 1];
    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    // translating z
    //view_matrix[14] = view_matrix[14] - 6;//zoom

    /*==================== Rotation ====================*/
    function moveXdir(m, amount) { m[12] = m[12] + 0.001; }
    function moveYdir(m, amount) { m[13] = m[13] + 0.001; }
    function moveZdir(m, amount) { m[14] = m[14] - 0.001; }
    function rotateZ(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

        m[0] = c * m[0] - s * m[1];
        m[4] = c * m[4] - s * m[5];
        m[8] = c * m[8] - s * m[9];

        m[1] = c * m[1] + s * mv0;
        m[5] = c * m[5] + s * mv4;
        m[9] = c * m[9] + s * mv8;
    }

    function rotateX(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];

        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;

        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    }

    function rotateY(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];

        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    }

    /*================= Drawing ===========================*/
    var time_old = 0;

    var animate = function (time) {

      var dt = time - time_old;
        
        //moveZdir(mov_matrix, dt * 0.0001);
        //rotateZ(mov_matrix, dt * 0.005);//time
        //rotateY(mov_matrix, dt * 0.001);//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
        //rotateX(mov_matrix, dt * 0.003);
      time_old = time;
       
        //gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        ////gl.depthFunc(gl.LEQUAL);
        ////gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        //gl.frontFace(gl.CCW);
        //gl.cullFace(gl.BACK);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        //requestAnimationFrame(animate);
        window.requestAnimationFrame(animate);
    };
    //requestAnimationFrame(animate);
    animate(0);
};
