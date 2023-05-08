<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Log;

class VerifyPusherWebhook
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        Log::debug("pusher webhook seen");
        if (!$request->hasHeader('X_PUSHER_KEY'))
        {
            Log::debug("no X_PUSHER_KEY");
            return response([ "errors" => ["webhook" => "Missing X_PUSHER_KEY header."] ], 400);
        }
        $incoming_key = $request->header('X_PUSHER_KEY');

        if (!$request->hasHeader('X_PUSHER_SIGNATURE'))
        {
            Log::debug("no X_PUSHER_SIGNATURE");
            return response([ "errors" => ["webhook" => "Missing X_PUSHER_SIGNATURE header."] ], 400);
        }
        $webhook_signature = $request->header('X_PUSHER_SIGNATURE');

        $app_secret = config('broadcasting.connections.pusher.secret', 'ABCDEFG');
        $expected_signature = hash_hmac(
            'sha256',
            $request->getContent(),
            $app_secret,
            false
        );

        if ($webhook_signature != $expected_signature)
        {
            return response([ "errors" => ["webhook" => "Signature failure."] ], 400);
        }

        return $next($request);
    }
}
