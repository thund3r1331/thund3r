
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("shader-background")

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    shaderMaterial.uniforms.u_resolution.value.x = window.innerWidth
    shaderMaterial.uniforms.u_resolution.value.y = window.innerHeight
  })

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      
      #define PI 3.14159265359
      
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      
      vec2 voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        
        vec2 mg, mr;
        float md = 8.0;
        
        for(int i = -1; i <= 1; i++) {
          for(int j = -1; j <= 1; j++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash(n + g) * vec2(0.5) + 0.5;
            vec2 r = g + o - f;
            float d = dot(r, r);
            
            if(d < md) {
              md = d;
              mr = r;
              mg = g;
            }
          }
        }
        
        return vec2(md, (n + mg).x + (n + mg).y * 0.5);
      }
      
      float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 5; i++) {
          f += w * voronoi(p).x;
          p *= 2.0;
          w *= 0.5;
        }
        return f;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        uv.x *= u_resolution.x / u_resolution.y;
        
        vec2 mouse = u_mouse / u_resolution.xy;
        
        float time = u_time * 0.2;
        
        vec2 p = uv * 3.0;
        p.x += sin(time * 0.5) * 0.5;
        p.y += cos(time * 0.3) * 0.5;
        
        p += (mouse - 0.5) * 2.0;
        
        vec2 c = voronoi(p);
        float pattern = c.x;
        
        float fbmValue = fbm(p * 2.0 + time * 0.1);
        pattern = mix(pattern, fbmValue, 0.5);
        vec3 col1 = vec3(0.1, 0.1, 0.2);
        vec3 col2 = vec3(0.3, 0.2, 0.5);
        vec3 col3 = vec3(0.6, 0.4, 0.8);
        
        vec3 color = mix(col1, col2, pattern);
        color = mix(color, col3, fbmValue * 0.5);
        
        float glow = sin(time) * 0.5 + 0.5;
        color += vec3(0.1, 0.05, 0.2) * glow * (1.0 - pattern);
        
        float vignette = 1.0 - length(uv - 0.5) * 0.8;
        color *= vignette;
        
        color += vec3(0.05, 0.02, 0.1) * sin(time * 2.0 + uv.x * 5.0) * sin(time * 1.5 + uv.y * 5.0);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, shaderMaterial)
  scene.add(mesh)

  document.addEventListener("mousemove", (event) => {
    shaderMaterial.uniforms.u_mouse.value.x = event.clientX
    shaderMaterial.uniforms.u_mouse.value.y = window.innerHeight - event.clientY
  })
  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)

    shaderMaterial.uniforms.u_time.value = clock.getElapsedTime()

    renderer.render(scene, camera)
  }

  animate()
})
