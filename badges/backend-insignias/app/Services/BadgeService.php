<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\DashboardStat;
use Illuminate\Support\Facades\DB;

class BadgeService
{
    public function evaluate($userId, $totalAhorrado = null)
    {
        if ($totalAhorrado === null) {
            $stat = DashboardStat::where('user_id', $userId)->first();
            $totalAhorrado = $stat ? $stat->ingresos_mes : 0;
        }

        $this->checkFirstDeposit($userId, $totalAhorrado);
        $this->checkTotalSaved($userId, $totalAhorrado);
    }

    private function checkFirstDeposit($userId, $totalAhorrado)
    {
        if ($totalAhorrado > 0) {
            $this->awardBadge($userId, 'primer_ahorro');
        }
    }

    private function checkTotalSaved($userId, $totalAhorrado)
    {
        if ($totalAhorrado >= 5000)   $this->awardBadge($userId, 'cerdito_feliz');
        if ($totalAhorrado >= 10000)  $this->awardBadge($userId, 'constante_tortuga');
        if ($totalAhorrado >= 30000)  $this->awardBadge($userId, 'vision_financiera');
        if ($totalAhorrado >= 60000)  $this->awardBadge($userId, 'maestro_ahorro');
        if ($totalAhorrado >= 100000) $this->awardBadge($userId, 'meta_millennial');
    }

    private function awardBadge($userId, $badgeKeyName)
    {
        $badge = Badge::where('key_name', $badgeKeyName)->first();
        if (!$badge) return;

        $exists = DB::table('usuario_insignias')
            ->where('user_id', $userId)
            ->where('insignia_id', $badge->id)
            ->exists();

        if (!$exists) {
            DB::table('usuario_insignias')->insert([
                'user_id'          => $userId,
                'insignia_id'      => $badge->id,
                'progreso_actual'  => 100,
                'completada'       => 1,
                'fecha_desbloqueo' => now(),
            ]);
        }
    }
}
