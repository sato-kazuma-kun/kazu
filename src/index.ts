import main from "./main";

function checkRawModeSupport(): boolean {
    if (!process.stdin.isTTY) {
        console.warn("Raw mode is not supported: The input is not a TTY.");
        return false;
    }

    try {
        const og = process.stdin.isRaw;
        process.stdin.setRawMode(true);
        process.stdin.setRawMode(og); // Restore the original state immediately
        return true;
    } catch (error) {
        console.warn(
            "Raw mode is not supported: Your terminal does not support raw input mode."
        );
        return false;
    }
}

const isRawModeSupported = checkRawModeSupport();

if (!isRawModeSupported) {
    process.exit(1); // Use standard error exit code
} else {
    main().catch((error) => {
        console.error("An unexpected error occurred:", error.message);
        process.exit(1);
    });
}
