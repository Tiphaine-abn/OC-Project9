/**
 * 
 */

import { getMonth } from ".";

describe("Date helper", () => {
    describe("When getMonth is called", () => {
        it("the function return janvier for 2022-01-01 as date", () => {
            // Appel de la fonction avec une date
            const month = getMonth(new Date("2022-01-01"))
            // Vérification du résultat attendu
            expect(month).toBe("janvier");
        });
        it("the function return juillet for 2022-07-08 as date", () => {
            // Appel de la fonction avec une autre date
            const month = getMonth(new Date("2022-07-08"));
            // Vérification du résultat attendu
            expect(month).toBe("juillet");
        });
    });
})

