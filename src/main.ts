import "./style.css";
const form = document.getElementById("cubic-form") as HTMLFormElement;
const pValue = document.getElementById("p-value") as HTMLTableElement;
const qValue = document.getElementById("q-value") as HTMLElement;
const discriminant = document.getElementById("discriminant") as HTMLElement;
const value = document.getElementById("value") as HTMLElement;
const root1 = document.getElementById("value") as HTMLElement;
const root2 = document.getElementById("value") as HTMLElement;
const root3 = document.getElementById("value") as HTMLElement;

// Complex number type
type Complex = { re: number; im: number };

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
    const r = Math.sqrt(z.re * z.re + z.im * z.im);
    const theta = Math.atan2(z.im, z.re);
    return {
      re: Math.cbrt(r) * Math.cos(theta / 3),
      im: Math.cbrt(r) * Math.sin(theta / 3),
    };
  },
};

// Cube roots of unity(constants omega and omega2)
const omega: Complex = { re: -0.5, im: Math.sqrt(3) / 2 };
const omega2: Complex = { re: -0.5, im: -Math.sqrt(3) / 2 };

form.addEventListener("submit", (event) => {
  const formData = new FormData(form);
  const a: number = Number(formData.get("a"));
  const b: number = Number(formData.get("b"));
  const c: number = Number(formData.get("c"));
  const d: number = Number(formData.get("d"));

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
  const root1: Complex = C.add(t1, { re: shift, im: 0 });
  const root2: Complex = C.add(t2, { re: shift, im: 0 });
  const root3: Complex = C.add(t3, { re: shift, im: 0 });
  console.log(pValue.textContent);
  pValue.textContent = p.toString()

  if (delta > 0) {
    console.log("One real root:", root1.re);
    console.log("Two complex roots:", root2, root3);
  } else if (delta === 0) {
    if (p === 0 && q === 0) {
      console.log("Triple root:", root1.re);
    } else {
      console.log("Double root:", root1.re);
      console.log("Simple root:", root2.re);
    }
  } else {
    console.log("Three distinct real roots:", root1.re, root2.re, root3.re);
  }
});
