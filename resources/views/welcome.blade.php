<!DOCTYPE html>
<html data-theme="halloween" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="viewport-fit=cover">

        <title>Laravel</title>

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <body class="antialiased">
        <div id="app" class="container"></div>
        @viteReactRefresh
        @vite('resources/js/app.jsx')

        <script>
            let name = "{{session()->get('name')}}";
            let user_id = "{{session()->get('user_id')}}"
        </script>
    </body>
</html>
