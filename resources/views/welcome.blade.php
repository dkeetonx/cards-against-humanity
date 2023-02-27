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
    <body class="antialiased  min-h-screen flex flex-col">
        <div id="navBar"></div>
        <div id="app" class="container mx-auto flex flex-grow"></div>
        @include('footer')
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </body>
</html>
