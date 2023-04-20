<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Cards Against Humanity</title>

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <body class="h-screen min-h-screen max-h-screen">
        <div id="app" class="h-screen min-h-screen max-h-screen flex flex-col bg-base-300"></div>
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </body>
</html>
