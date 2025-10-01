export class Color {
    // ----- Reactive state -----
    #h = $state(0);      // Hue
    #sHsv = $state(0);   // Saturation (HSV)
    #v = $state(0);      // Value (HSV)
    #sHsl = $state(0);   // Saturation (HSL)
    #l = $state(0);      // Lightness (HSL)
    #r = $state(0);      // Red
    #g = $state(0);      // Green
    #b = $state(0);      // Blue
    #a = $state(1);      // Alpha

    constructor(hex: string = "#000000") {
        this.set(this.hexToRgb(hex));
    }

    // ----- Getters -----
    get h() { return this.#h; }
    get sHsv() { return this.#sHsv; }
    get v() { return this.#v; }
    get sHsl() { return this.#sHsl; }
    get l() { return this.#l; }
    get r() { return this.#r; }
    get g() { return this.#g; }
    get b() { return this.#b; }
    get a() { return this.#a; }

    get RGB() { return { r: this.#r, g: this.#g, b: this.#b }; }
    get RGBA() { return { r: this.#r, g: this.#g, b: this.#b, a: this.#a }; }
    get HSV() { return { h: this.#h, s: this.#sHsv, v: this.#v }; }
    get HSL() { return { h: this.#h, s: this.#sHsl, l: this.#l }; }

    // ----- Main setter -----
    set(values:
        (Partial<{ h: number; sHsl: number; l: number }>
            | Partial<{ h: number; sHsv: number; v: number }>
            | Partial<{ r: number; g: number; b: number }>)
        & { a?: number }
        | { hex: string }): this {
        // Hex handling first
        if ('hex' in values) {
            const hexValue = values.hex.trim();
            const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
            if (!hexRegex.test(hexValue)) throw new Error(`Invalid hex color: ${hexValue}`);

            // Remove # and pad alpha if missing
            let hex = hexValue.startsWith("#") ? hexValue.slice(1) : hexValue;
            if (hex.length === 6) hex += "FF";

            // Convert hex to RGBA
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const a = parseInt(hex.slice(6, 8), 16) / 255;

            this.updateFromRGB({ r, g, b });
            this.#a = a;
            return this;
        }

        // Existing logic for RGB, HSV, HSL
        if (values.a !== undefined) this.#a = clamp01(values.a);

        if ('r' in values || 'g' in values || 'b' in values) {
            this.updateFromRGB(values as Partial<{ r: number; g: number; b: number }>);
        } else if ('sHsv' in values || 'v' in values || 'h' in values) {
            this.updateFromHSV(values as Partial<{ h: number; sHsv: number; v: number }>);
        } else if ('sHsl' in values || 'l' in values || 'h' in values) {
            this.updateFromHSL(values as Partial<{ h: number; sHsl: number; l: number }>);
        }

        return this;
    }


    // ----- Update helpers -----
    private updateFromRGB({ r, g, b }: Partial<{ r: number; g: number; b: number }>) {
        this.#r = r ?? this.#r;
        this.#g = g ?? this.#g;
        this.#b = b ?? this.#b;

        this.computeHSV();
        this.computeHSL();
    }

    private updateFromHSV({ h, sHsv, v }: Partial<{ h: number; sHsv: number; v: number }>) {
        this.#h = h ?? this.#h;
        this.#sHsv = sHsv ?? this.#sHsv;
        this.#v = v ?? this.#v;

        // HSV -> RGB
        const c = this.#v * this.#sHsv;
        const x = c * (1 - Math.abs(((this.#h / 60) % 2) - 1));
        const m = this.#v - c;

        let rr = 0, gg = 0, bb = 0;
        if (this.#h < 60) [rr, gg, bb] = [c, x, 0];
        else if (this.#h < 120) [rr, gg, bb] = [x, c, 0];
        else if (this.#h < 180) [rr, gg, bb] = [0, c, x];
        else if (this.#h < 240) [rr, gg, bb] = [0, x, c];
        else if (this.#h < 300) [rr, gg, bb] = [x, 0, c];
        else[rr, gg, bb] = [c, 0, x];

        this.#r = Math.round((rr + m) * 255);
        this.#g = Math.round((gg + m) * 255);
        this.#b = Math.round((bb + m) * 255);

        this.computeHSL();
    }

    private updateFromHSL({ h, sHsl, l }: Partial<{ h: number; sHsl: number; l: number }>) {
        this.#h = h ?? this.#h;
        this.#sHsl = sHsl ?? this.#sHsl;
        this.#l = l ?? this.#l;

        // HSL -> RGB
        const c = (1 - Math.abs(2 * this.#l - 1)) * this.#sHsl;
        const x = c * (1 - Math.abs(((this.#h / 60) % 2) - 1));
        const m = this.#l - c / 2;

        let rr = 0, gg = 0, bb = 0;
        if (this.#h < 60) [rr, gg, bb] = [c, x, 0];
        else if (this.#h < 120) [rr, gg, bb] = [x, c, 0];
        else if (this.#h < 180) [rr, gg, bb] = [0, c, x];
        else if (this.#h < 240) [rr, gg, bb] = [0, x, c];
        else if (this.#h < 300) [rr, gg, bb] = [x, 0, c];
        else[rr, gg, bb] = [c, 0, x];

        this.#r = Math.round((rr + m) * 255);
        this.#g = Math.round((gg + m) * 255);
        this.#b = Math.round((bb + m) * 255);

        this.computeHSV();
    }

    // ----- Compute derived properties -----
    private computeHSV() {
        const rr = this.#r / 255, gg = this.#g / 255, bb = this.#b / 255;
        const max = Math.max(rr, gg, bb);
        const min = Math.min(rr, gg, bb);
        const delta = max - min;

        let h = 0;
        if (delta !== 0) {
            if (max === rr) h = 60 * (((gg - bb) / delta) % 6);
            else if (max === gg) h = 60 * ((bb - rr) / delta + 2);
            else h = 60 * ((rr - gg) / delta + 4);
        }
        if (h < 0) h += 360;

        this.#h = h;
        this.#v = max;
        this.#sHsv = max === 0 ? 0 : delta / max;
    }

    private computeHSL() {
        const rr = this.#r / 255, gg = this.#g / 255, bb = this.#b / 255;
        const max = Math.max(rr, gg, bb);
        const min = Math.min(rr, gg, bb);
        const delta = max - min;

        const l = (max + min) / 2;
        this.#l = l;
        this.#sHsl = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    }

    // ----- Hex helpers -----
    private hexToRgb(hex: string) {
        if (!hex.startsWith("#")) hex = "#" + hex;
        const h = hex.slice(1);
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return { r, g, b };
    }

    private componentToHex(c: number) {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    get hexWithoutAlpha() {
        return `#${this.componentToHex(this.#r)}${this.componentToHex(this.#g)}${this.componentToHex(this.#b)}`;
    }

    get hexWithAlpha() {
        return `#${this.componentToHex(this.#r)}${this.componentToHex(this.#g)}${this.componentToHex(this.#b)}${this.componentToHex(this.#a * 255)}`;
    }
}

// ----- Utility -----
function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
}
