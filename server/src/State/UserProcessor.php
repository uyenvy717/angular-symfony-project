<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\AffiliatePartner;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class UserProcessor implements ProcessorInterface
{

    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $processor,
        private UserRepository $userRepository,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if (!$data instanceof User)
        {
            throw new UnprocessableEntityHttpException('This is crap');
        }
        if ($data->getPartner() instanceof AffiliatePartner) {
            throw new UnprocessableEntityHttpException('AffiliatePartner is not allowed');
        }
        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}