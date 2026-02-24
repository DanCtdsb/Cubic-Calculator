import './style.css'
const form = document.getElementById("cubic-form") as HTMLFormElement;



form.addEventListener("evaluate", (event) => {
    const formData = new FormData(form);

    const a: number = Number(formData.get("a"));
    const b: number = Number(formData.get("b"));
    const c: number = Number(formData.get("c"));
    const d: number = Number(formData.get("d"));

    const p: number = (3 * a * c - b * b) / ( 3 * a * a)
    const q: number = (27 * a * a * d - 9 * a * b * c + 2 * b * b * b) / (27 * a * a * a)
    const delta: number =  q * q / 4 + p * p * p / 27
    const u: number = Math.cbrt(-q / 2 + Math.sqrt(delta))
    const v: number = Math.cbrt(-q / 2 - Math.sqrt(delta))
    const root1: number = u + v - b / (3 * a)
    if (delta > 0) {
        
    } 
    


})