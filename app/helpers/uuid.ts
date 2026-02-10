/**
 * Generates a UUID string.
 * @returns {String} The generated UUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
export default function uuid(): string {
    function p8(s?: boolean): string {
        const p = `${Math.random().toString(16)}000000000`.substr(2, 8);

        return s ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p;
    }

    return p8() + p8(true) + p8(true) + p8();
}
