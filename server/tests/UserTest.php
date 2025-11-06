<?php

namespace App\Tests;

use App\Entity\User;
use App\Repository\PartnerRepository;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserTest extends AbstractTest
{
    private array $body = [
        'email' => 'admin@user',
        'password' => 'testpassword',
    ];

    // Growth partner get users in scope
    public function testGetUsers(): void
    {
        $this->createClientWithCredentials()->request('GET', '/api/users');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@id' => '/api/users',
            '@type' => 'Collection',
            'totalItems' => 2
        ]);

        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    // Top-level account get users in scope
    public function testGetAllUser(): void
    {
        $this->createClientWithCredentials(null, $this->body)->request('GET', '/api/users');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@id' => '/api/users',
            '@type' => 'Collection',
            'totalItems' => 2
        ]);

        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    // Growth partner create user in scope
    public function testCreateUser(): void
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $passwordHasher = $this->getContainer()->get(UserPasswordHasherInterface::class);

        $partner = $partnerRepository->findOneBy(['name' => 'SolutionPartner']);

        // Hash the password before sending it in the request
        $hashedPassword = $passwordHasher->hashPassword(new User('Test User', 'test@user.com', $partner), 'password123');

        $payload = [
            'name' => 'Test User',
            'email' => 'test@user.com',
            'password' => $hashedPassword,
            'partner' => '/api/solution_partners/'.$partner->getId(),
        ];

        $this->createClientWithCredentials()->request('POST', '/api/users', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    // Top-level account can create user for any partner
    public function testCreateAnyUser(): void
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $passwordHasher = $this->getContainer()->get(UserPasswordHasherInterface::class);

        $partner = $partnerRepository->findOneBy(['name' => 'SolutionPartner2']);

        // Hash the password before sending it in the request
        $hashedPassword = $passwordHasher->hashPassword(new User('Test User', 'test@user.com', $partner), 'password123');

        $payload = [
            'name' => 'Test User',
            'email' => 'test@user.com',
            'password' => $hashedPassword,
            'partner' => '/api/solution_partners/'.$partner->getId(),
        ];

        $this->createClientWithCredentials(null, $this->body)->request('POST', '/api/users', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    // Growth partner cannot update the user's information out of the scope
    public function testUpdateUser(): void
    {
        $userRepository = $this->getContainer()->get(UserRepository::class);
        $userId = $userRepository->findOneBy(['name' => 'AfflUser'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test User',
        ];

        $response = $this->createClientWithCredentials()->request('PATCH', '/api/users/'.$userId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertJsonContains([
            'title' => 'An error occurred',
            'description' => 'Access Denied.'
        ]);
        $this->assertResponseStatusCodeSame(403);
    }

    // Top-level account can update any user
    public function testUpdateAnyUser(): void
    {
        $userRepository = $this->getContainer()->get(UserRepository::class);
        $userId = $userRepository->findOneBy(['name' => 'NBUser'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test User',
        ];

        $response = $this->createClientWithCredentials(null, $this->body)->request('PATCH', '/api/users/'.$userId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }
}