<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\PartnerRepository;

class ClientStateProvider implements ProviderInterface
{
    private PartnerRepository $partnerRepository;

    public function __construct(PartnerRepository $partnerRepository)
    {
        $this->partnerRepository = $partnerRepository;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?array
    {
        $id = $uriVariables['id'] ?? null;

        if (!$id) {
            return null;
        }

        return $this->partnerRepository->findAllGrowthPartnerClient($id);
    }
}