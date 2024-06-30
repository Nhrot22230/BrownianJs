const canvas = document.getElementById("cartesian-plane");
const ctx = canvas.getContext("2d");
const originX = 0;
const originY = 0;

const brownianMotion = 4;
const particles = [];
const cantParticles = 25;
for (let i = 0; i < cantParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 15,
  });
}

const laserAcceleration = 1.75;
const staticFriction = 0.65;
const kineticFriction = 0.85;
const laser = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  velocityX: 0,
  velocityY: 0,
  radius: 15,
  color: "red",
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Función para manejar la presión de teclas
function handleKeyDown(event) {
  if (event.key in keys) keys[event.key] = true;
}

function handleKeyUp(event) {
  if (event.key in keys) keys[event.key] = false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function updateLaser() {
  let laserFriction = 1;
  if ( Math.abs(laser.velocityX) < 2 && Math.abs(laser.velocityY) < 2 ) {
    laserFriction = staticFriction;
  }
  else {
    laserFriction = kineticFriction;
  }

  if (keys.w) laser.velocityY -= laserAcceleration;
  if (keys.a) laser.velocityX -= laserAcceleration;
  if (keys.s) laser.velocityY += laserAcceleration;
  if (keys.d) laser.velocityX += laserAcceleration;

  // Aplicar fricción para inercia
  laser.velocityX *= laserFriction;
  laser.velocityY *= laserFriction;

  // Actualizar posición basada en la velocidad
  laser.x += laser.velocityX;
  laser.y += laser.velocityY;

  // Limitar el láser dentro del canvas
  laser.x = Math.min(canvas.width - laser.radius, laser.x);
  laser.x = Math.max(laser.radius, laser.x);
  laser.y = Math.min(canvas.height - laser.radius, laser.y);
  laser.y = Math.max(laser.radius, laser.y);
}

function drawCartesianPlane() {
  // Dibujamos las coordenadas
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  //draw y axis
  ctx.beginPath();
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, canvas.height);
  ctx.stroke();

  // draw y axis but the other side
  ctx.beginPath();
  ctx.moveTo(canvas.width, originY);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  // draw x axis
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(canvas.width, originY);
  ctx.stroke();

  // draw x axis but the other side
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();

  /*
  for (let i = 0; i < canvas.height / 6; i++) {
    ctx.moveTo(originX - 5, 20 * i * 10);
    ctx.fillText(i * 10, originX + 15, 20 * i * 10);
  }

  for (let i = 0; i < canvas.width / 6; i++) {
    ctx.moveTo(20 * i * 10, originY - 5);
    ctx.fillText(i * 10, 20 * i * 10, originY + 15);
  }
  */
}

function DrawParticle(x, y, radius, color = "black") {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function DrawParticles(particles) {
  for (let i = 0; i < particles.length; i++) {
    DrawParticle(particles[i].x, particles[i].y, particles[i].radius);
  }
}

function UpdateParticles(particles) {
  // if particle is near the laser, move it to the laser
  for (let i = 0; i < particles.length; i++) {
    if (
      Math.abs(particles[i].x - laser.x) < 11.5 &&
      Math.abs(particles[i].y - laser.y) < 11.5
    ) {
      particles[i].x = laser.x;
      particles[i].y = laser.y;
    }
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].x += (Math.random() - 0.5) * brownianMotion;
    particles[i].y += (Math.random() - 0.5) * brownianMotion;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].x = Math.min(canvas.width, particles[i].x);
    particles[i].x = Math.max(0, particles[i].x);
    particles[i].y = Math.min(canvas.height, particles[i].y);
    particles[i].y = Math.max(0, particles[i].y);
  }
}
// Función de animación
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCartesianPlane();
  DrawParticles(particles);
  DrawParticle(laser.x, laser.y, laser.radius, laser.color);
  
  UpdateParticles(particles);
  updateLaser();
  requestAnimationFrame(animate);
}

// Llamamos a la función animate por primera vez
requestAnimationFrame(animate);
