<?php

namespace App\Interface;

use Symfony\Component\Uid\Uuid;

interface IDable
{
    public function getId(): ?Uuid;
}
