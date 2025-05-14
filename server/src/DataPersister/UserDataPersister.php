<?php

namespace App\DataPersister;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserDataPersister implements ProcessorInterface
{
    private $decorated;
    private $passwordHasher;

    public function __construct(ProcessorInterface $decorated, UserPasswordHasherInterface $passwordHasher)
    {
        $this->decorated = $decorated;
        $this->passwordHasher = $passwordHasher;
    }

    public function process($data, \ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof User) {
            // Always hash password on POST (creation)
            if ($operation instanceof \ApiPlatform\Metadata\Post && $data->getPassword()) {
                $data->setPassword(
                    $this->passwordHasher->hashPassword($data, $data->getPassword())
                );
            }
            // Only hash password on PATCH if password is present in the input
            elseif ($operation instanceof \ApiPlatform\Metadata\Patch && isset($context['input']['password']) && $data->getPassword()) {
                $data->setPassword(
                    $this->passwordHasher->hashPassword($data, $data->getPassword())
                );
            }
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}
