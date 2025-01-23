import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useState, useEffect } from 'react';
import { existsSync, readdir } from 'fs';
import { resolve, join } from 'path';
import clipboard from 'clipboardy';
import Setup from './setup';

const CLI = ({ developmentDir, configPath }: { developmentDir: string; configPath: string; }) => {
    const [folders, setFolders] = useState<string[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<number>(0);
    const [currentPath, setCurrentPath] = useState<string>(resolve(developmentDir));
    const [input, setInput] = useState<string>('');
    const [exitOnNextRerender, setExitOnNextRerender] = useState(false);
    const [renderSetup, setRenderSetup] = useState(false);
    const [cmdError, setCmdError] = useState('');

    if (!existsSync(developmentDir)) {
        console.error('The Development directory does not exist.');
        process.exit(1);
    }

    useEffect(() => {
        readdir(currentPath, { withFileTypes: true }, (err, files) => {
            if (err) throw err;
            const dirs = files.filter(file => file.isDirectory()).map(dir => dir.name);
            setFolders(dirs);
        });
    }, [currentPath]);

    useInput((_, key) => {
        if (key.upArrow) {
            setSelectedFolder((prev) => (prev > 0 ? prev - 1 : folders.length - 1));
        }
        if (key.downArrow) {
            setSelectedFolder((prev) => (prev < folders.length - 1 ? prev + 1 : 0));
        }
        if (key.tab) {
            if (folders.length > 0) {
                setCurrentPath(join(currentPath, folders[selectedFolder] as string));
            }
        }
    });

    const handleInputChange = (value: string) => {
        setInput(value);
    };

    const handleSubmit = async () => {
        if (input.toLowerCase() === 'exit') {
            setExitOnNextRerender(true);
        } else if (input.toLowerCase() === 'cd') {
            try {
                clipboard.writeSync(`cd "${currentPath}"`);
                console.log(`\x1b[1mCopied: \x1b[32mcd "${currentPath}"\x1b[0m\x1b[1m to clipboard.\x1b[0m`);
                setExitOnNextRerender(true);
            } catch (error) {
                console.error(`\x1b[31mSomething went wrong when trying to copy: \x1b[1mcd "${currentPath}"\x1b[0m\x1b[22m`);
                console.log("\x1b[31mIf you are in a Debian based Linux Distro try running \x1b[32m\x1b[1msudo apt install xsel\x1b[0m.");
                setExitOnNextRerender(true);
            }
        } else if (input.toLowerCase() === "setup") {
            setRenderSetup(true);
        } else {
            setCmdError("Command not found!");
        }
    };

    useEffect(() => {
        if (exitOnNextRerender) {
            process.exit();
        };
    }, [exitOnNextRerender]);

    if (renderSetup) return <Setup configPath={configPath} />;

    return !exitOnNextRerender ? (
        <Box flexDirection="column" marginTop={1}>
            <Box>
                <Text bold={true} color={"green"}>Use Arrow keys to navigate & Tab key to select.</Text>
            </Box>

            {folders.map((folder, index) => (
                <Text key={folder} bold={true} backgroundColor={index === selectedFolder ? "green" : undefined} color={'white'}>
                    {folder}
                </Text>
            ))}

            <Box marginTop={1}>
                <Text bold={true} color={"green"}>Type commands here, press enter when done.</Text>
            </Box>

            {cmdError && (
                <Box marginTop={1}>
                    <Text color="red">{cmdError}</Text>
                </Box>
            )}

            <Box>
                <TextInput
                    value={input}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    showCursor={true}
                    placeholder="Type 'exit' to quit or 'cd' to navigate or 'setup' to change configs."
                />
            </Box>
        </Box>
    ) : <></>;
};

export default CLI;