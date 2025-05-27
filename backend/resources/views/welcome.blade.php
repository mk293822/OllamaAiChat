<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Streaming Chat</title>
</head>
<body>
    {{-- <form id="chat-form">
        <input type="text" id="prompt" placeholder="Enter your prompt">
        <button type="submit">Send</button>
    </form>

    <pre id="chat-output" ></pre>

    <script>
        const form = document.getElementById('chat-form');
        const output = document.getElementById('chat-output');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            output.textContent = ''; // Clear output
            const prompt = document.getElementById('prompt').value;

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                },
                body: JSON.stringify({ prompt })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunk = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                chunk = decoder.decode(value, { stream: true });
                output.innerHtml += chunk;
            }
        });
    </script> --}}
</body>
</html>
