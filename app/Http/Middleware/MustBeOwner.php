<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MustBeOwner
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
        $user = Auth::user();

        if (!$user)
        {
            return response()->json([
                "message" => "Access denied"
            ], 401);
        }

        if (!$user->gameRoom)
        {
            return response()->json([
                "message" => "You must be in a game room to use this endpoint"
            ], 401);
        }
        if ($user->gameRoom && $user->gameRoom->owner_id !== $user->id)
        {
            return response()->json([
                "message" => "You must be the owner to use this endpoint",
            ], 401);            
        }
        return $next($request);
    }
}
