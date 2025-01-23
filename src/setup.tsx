import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { existsSync, writeFileSync } from 'fs';

const Setup = ({ configPath }: { configPath: string; }) => {
    const [developmentDir, setDevelopmentDir] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [exitOnNextRerender, setExitOnNextRerender] = useState(false);

    const handleSubmit = () => {
        if (developmentDir === ":exit") {
            setExitOnNextRerender(true);
            return;
        }

        if (!existsSync(developmentDir)) {
            setError('Invalid directory. Please provide an existing path.');
            return;
        }

        // Save the configuration
        try {
            writeFileSync(configPath, JSON.stringify({ developmentDir }, null, 2));
            setError('');
            setSuccess(true);
        } catch (error) {
            setError('Failed to write configuration file.');
        }
    };

    useEffect(() => {
        if (success) {
            process.exit();
        }

        if (exitOnNextRerender) {
            process.exit();
        }
    }, [success, exitOnNextRerender]);

    if (exitOnNextRerender) return (<></>);

    return success ? (
        <Box marginTop={1}>
            <Text color="green">Configuration saved successfully, run the CLI tool again!</Text>
        </Box>
    ) : (
        <Box flexDirection="column" marginTop={1}>
            <Text color="cyan" bold>
                Development Directory Setup
            </Text>

            <Box marginTop={1}>
                <Text>Enter the path to your Development directory or a command to perform:</Text>
            </Box>

            <Box marginBottom={1}>
                <TextInput
                    value={developmentDir}
                    onChange={setDevelopmentDir}
                    placeholder="(/home/username/Development)"
                    onSubmit={handleSubmit}
                />
            </Box>

            {error && (
                <Box marginTop={1}>
                    <Text color="red">{error}</Text>
                </Box>
            )}

            <Box marginTop={1}>
                <Text dimColor>Press Enter to save the configuration or :exit to exit.</Text>
            </Box>
        </Box>
    );
};

export default Setup;
