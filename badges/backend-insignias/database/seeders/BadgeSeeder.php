<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $insignias = [
            
            ['key_name' => 'primer_ahorro', 'titulo' => 'Primer Ahorro', 'descripcion' => 'Cuando el usuario registra su primer depósito.', 'meta_valor' => 1, 'icono_url' => '🥇'],
            ['key_name' => 'meta_creada', 'titulo' => 'Meta Creada', 'descripcion' => 'Por crear su primera meta de ahorro.', 'meta_valor' => 1, 'icono_url' => '🎯'],
            ['key_name' => 'primer_chequeo', 'titulo' => 'Primer chequeo de gastos', 'descripcion' => 'Por su primera consulta financiera.', 'meta_valor' => 1, 'icono_url' => '📊'],

            ['key_name' => 'cerdito_feliz', 'titulo' => 'Cerdito Feliz', 'descripcion' => '$5,000 acumulados.', 'meta_valor' => 5000, 'icono_url' => '🐷'],
            ['key_name' => 'constante_tortuga', 'titulo' => 'Constante como Tortuga', 'descripcion' => '$10,000 acumulados.', 'meta_valor' => 10000, 'icono_url' => '🐢'],
            ['key_name' => 'vision_financiera', 'titulo' => 'Visión Financiera', 'descripcion' => '$30,000 acumulados.', 'meta_valor' => 30000, 'icono_url' => '🦅'],
            ['key_name' => 'maestro_ahorro', 'titulo' => 'Maestro del Ahorro', 'descripcion' => '$60,000 acumulados.', 'meta_valor' => 60000, 'icono_url' => '👑'],
            ['key_name' => 'meta_millennial', 'titulo' => 'Meta Millennial', 'descripcion' => '$100,000 acumulados.', 'meta_valor' => 100000, 'icono_url' => '🚀'],

            ['key_name' => '7_dias_ahorrando', 'titulo' => '7 Días Ahorrando', 'descripcion' => 'Una semana completa ahorrando.', 'meta_valor' => 7, 'icono_url' => '📆'],
            ['key_name' => '30_dias_sin_fallar', 'titulo' => '30 Días Sin Fallar', 'descripcion' => 'Un mes completo de constancia.', 'meta_valor' => 30, 'icono_url' => '📅'],
            ['key_name' => 'racha_3_meses', 'titulo' => 'Racha de 3 Meses', 'descripcion' => 'Tres meses ahorrando sin fallar.', 'meta_valor' => 90, 'icono_url' => '🔥'],
            ['key_name' => 'disciplina_financiera', 'titulo' => 'Disciplina Financiera', 'descripcion' => '6 meses ahorrando seguido.', 'meta_valor' => 180, 'icono_url' => '💪'],
            ['key_name' => 'usuario_vip', 'titulo' => 'Usuario VIP', 'descripcion' => '1 año usando la app.', 'meta_valor' => 365, 'icono_url' => '⭐'],

            ['key_name' => 'primera_meta_alcanzada', 'titulo' => 'Primera Meta Alcanzada', 'descripcion' => 'Cumple tu primera meta.', 'meta_valor' => 1, 'icono_url' => '🏆'],
            ['key_name' => 'viaje_logrado', 'titulo' => 'Viaje Logrado', 'descripcion' => 'Meta de viaje alcanzada.', 'meta_valor' => 1, 'icono_url' => '✈️'],
            ['key_name' => 'educacion_asegurada', 'titulo' => 'Educación Asegurada', 'descripcion' => 'Meta educativa completada.', 'meta_valor' => 1, 'icono_url' => '🎓'],
            ['key_name' => 'mi_primer_auto', 'titulo' => 'Mi Primer Auto', 'descripcion' => 'Meta para tu primer auto.', 'meta_valor' => 1, 'icono_url' => '🚗'],

            ['key_name' => 'cazador_gastos_hormiga', 'titulo' => 'Cazador de Gastos Hormiga', 'descripcion' => 'Reduce gastos pequeños.', 'meta_valor' => 1, 'icono_url' => '🐜'],
            ['key_name' => 'comprador_inteligente', 'titulo' => 'Comprador Inteligente', 'descripcion' => 'Reduce gastos un 20%.', 'meta_valor' => 20, 'icono_url' => '🛒'],
            ['key_name' => 'planificador', 'titulo' => 'Planificador', 'descripcion' => 'Usa presupuestos mensuales.', 'meta_valor' => 1, 'icono_url' => '📝'],
        ];

        foreach ($insignias as $ins) {
            DB::table('insignias')->updateOrInsert(
                ['titulo' => $ins['titulo']], 
                $ins
            );
        }
    }
}