import "./style.css";
const form = document.getElementById("cubic-form") as HTMLFormElement;
const pValue = document.getElementById("p-value") as HTMLElement;
const qValue = document.getElementById("q-value") as HTMLElement;
const discriminant = document.getElementById("discriminant") as HTMLElement;
const strroot1 = document.getElementById("root1") as HTMLElement;
const strroot2 = document.getElementById("root2") as HTMLElement;
const strroot3 = document.getElementById("root3") as HTMLElement;
const equation = document.getElementById("equation") as HTMLElement;
const canvas = document.getElementById("graph") as HTMLCanvasElement;
const y1 = document.getElementById("y1") as HTMLCanvasElement;
const y2 = document.getElementById("y1") as HTMLCanvasElement;
const y3 = document.getElementById("y1") as HTMLCanvasElement;


const ctx = canvas.getContext("2d")!;

// Complex number type
type Complex = { re: number; im: number };

const drawGraph = (a: number, b: number, c: number, d: number) => {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  const x0 = width / 2;
  const y0 = height / 2;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, x0);
  ctx.lineTo(width, x0);
  ctx.moveTo(y0, 0);
  ctx.lineTo(y0, height);
  for (let i = 0; i <= width; i += 20) {
    ctx.moveTo(i, x0 - 5);
    ctx.lineTo(i, x0 + 5);
  }
  for (let i = 0; i <= height; i += 20) {
    ctx.moveTo(y0 - 5, i);
    ctx.lineTo(y0 + 5, i);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.lineWidth = 0.3;
  ctx.strokeStyle = "#000";
  for (let i = 0; i <= width; i += 20) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }
  for (let i = 0; i <= height; i += 20) {
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0055cc";

  const scaleX = 20;
  const scaleY = 20;
  let first = true;

  for (let px = 0; px <= width; px++) {
    const x = (px - x0) / scaleX;
    const y = a * x * x * x + b * x * x + c * x + d;
    const py = y0 - y * scaleY;
    if (first) {
      ctx.moveTo(px, py);
      first = false;
    }
    ctx.lineTo(px, py);
  }
  ctx.stroke();
};

const equationFunction = (a: number, b: number, c: number, d: number) => {
  return (
    (Math.abs(a) == 1 ? "x\u00b3 " : a + "x\u00b3 ") +
    (b != 0
      ? (b > 0 ? " + " : " - ") +
        (Math.abs(b) === 1 ? "x\u00b2 " : Math.abs(b) + "x\u00b2 ")
      : "") +
    (c != 0
      ? (c > 0 ? " + " : " - ") +
        (Math.abs(c) === 1 ? "x " : Math.abs(c) + "x ")
      : "") +
    (d != 0 ? (d > 0 ? " + " : " - ") + Math.abs(d) : "")
  );
};
// Object containing operations for complex numbers, because TypeScript does not support operator overloading
const C = {
  add: (z1: Complex, z2: Complex): Complex => ({
    re: z1.re + z2.re,
    im: z1.im + z2.im,
  }),
  sub: (z1: Complex, z2: Complex): Complex => ({
    re: z1.re - z2.re,
    im: z1.im - z2.im,
  }),
  mul: (z1: Complex, z2: Complex): Complex => ({
    re: z1.re * z2.re - z1.im * z2.im,
    im: z1.re * z2.im + z1.im * z2.re,
  }),
  sqrt: (z: Complex): Complex => {
    const r = Math.sqrt(z.re * z.re + z.im * z.im);
    const theta = Math.atan2(z.im, z.re);
    return {
      re: Math.sqrt(r) * Math.cos(theta / 2),
      im: Math.sqrt(r) * Math.sin(theta / 2),
    };
  },
  cbrt: (z: Complex): Complex => {
    const r = Math.hypot(z.re, z.im);
    const theta = Math.atan2(z.im, z.re);
    const mag = Math.cbrt(r);
    return {
      re: mag * Math.cos(theta / 3),
      im: mag * Math.sin(theta / 3),
    };
  },
};

// Cube roots of unity(constants omega and omega2)
const omega: Complex = { re: -0.5, im: Math.sqrt(3) / 2 };
const omega2: Complex = { re: -0.5, im: -Math.sqrt(3) / 2 };

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));
  drawGraph(a, b, c, d);

  const p: number = (3 * a * c - b * b) / (3 * a * a);
  const q: number =
    (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a);
  const shift: number = b / (3 * a);
  const delta: number = (q * q) / 4 + (p * p * p) / 27;
  const sqrtDelta: Complex = C.sqrt({ re: delta, im: 0 });
  const u3: Complex = C.add({ re: -q / 2, im: 0 }, sqrtDelta);
  const v3: Complex = C.sub({ re: -q / 2, im: 0 }, sqrtDelta);
  const u: Complex = C.cbrt(u3);
  const v: Complex = C.cbrt(v3);
  const t1: Complex = C.add(u, v);
  const t2: Complex = C.add(C.mul(omega, u), C.mul(omega2, v));
  const t3: Complex = C.add(C.mul(omega2, u), C.mul(omega, v));
  const root1: Complex = C.sub(t1, { re: shift, im: 0 });
  const root2: Complex = C.sub(t2, { re: shift, im: 0 });
  const root3: Complex = C.sub(t3, { re: shift, im: 0 });
  pValue.textContent = p.toString();
  qValue.textContent = q.toString();
  discriminant.textContent = delta.toString();
  equation.textContent = equationFunction(a, b, c, d);
  if (Math.abs(delta) < 1e-12) {
    const u = Math.cbrt(-q / 2);

    const t1 = 2 * u;
    const t2 = -u;
    const t3 = -u;

    const root1 = t1 - shift;
    const root2 = t2 - shift;
    const root3 = t3 - shift;

    strroot1.textContent = root1.toString();
    strroot2.textContent = root2.toString();
    strroot3.textContent = root3.toString();
    y1.textContent = "0";
    y2.textContent = "0";
    y3.textContent = "0";
    return;
  }

  function cleanReal(z: Complex): string {
    if (Math.abs(z.im) < 1e-10) {
      return Number(z.re.toFixed(12)).toString();
    }
    return "complex root";
  }

  if (delta > 0) {
    const sqrtDeltaReal = Math.sqrt(delta);
    const u = Math.cbrt(-q / 2 + sqrtDeltaReal);
    const v = Math.cbrt(-q / 2 - sqrtDeltaReal);
    const t1: Complex = { re: u + v, im: 0 };
    const root1 = C.sub(t1, { re: shift, im: 0 });
    strroot1.textContent = cleanReal(root1);
    strroot2.textContent = "complex root";
    strroot3.textContent = "complex root";
    y1.textContent = "0";
    y2.textContent = "complex root";
    y3.textContent = "complex root";


  } else if (delta == 0) {
    if (p === 0 && q === 0) {
      strroot1.textContent = cleanReal(root1);
      strroot2.textContent = cleanReal(root2);
      strroot3.textContent = cleanReal(root3);
    } else {
      strroot1.textContent = cleanReal(root1);
      strroot2.textContent = cleanReal(root2);
      strroot3.textContent = cleanReal(root3);
    }
  } else {
    strroot1.textContent = cleanReal(root1);
    strroot2.textContent = cleanReal(root2);
    strroot3.textContent = cleanReal(root3);
  }
});
