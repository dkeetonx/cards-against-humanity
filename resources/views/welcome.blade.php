<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <body class="antialiased overflwo-hidden">
        <div id="app" class="min-h-screen flex flex-col"></div>
        @include('footer')
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </body>
</html>
