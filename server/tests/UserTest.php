<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\AppFixtures;
use App\Entity\User;
use App\Repository\PartnerRepository;
use App\Repository\UserRepository;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;

class UserTest extends ApiTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $entityManager = $container->get(EntityManagerInterface::class);

        $purger = new ORMPurger($entityManager);
        $purger->purge();

        // Load fixtures
        $fixtureLoader = $container->get(AppFixtures::class);
        $fixtureLoader->load($entityManager);
        $entityManager->flush();
    }

    public function testGetUsers(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/users');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/User',
            '@id' => '/api/users',
            '@type' => 'Collection',
            'totalItems' => 3
        ]);

        $responseArray = $client->getResponse()->toArray();

        // Ensure the 'member' key exists and is an array
        $this->assertArrayHasKey('member', $responseArray);
        $this->assertIsArray($responseArray['member']);

        foreach ($responseArray['member'] as $userData) {
            // Check required keys
            $expectedKeys = ['@id', '@type', 'name', 'email', 'lastLoggedIn', 'id', 'partner', 'active'];
            $actualKeys = array_keys($userData);
            sort($expectedKeys);
            sort($actualKeys);
            $this->assertSame($expectedKeys, $actualKeys, 'The response contains unexpected keys.');

            // Validate data types
            $this->assertIsString($userData['@id']);
            $this->assertIsString($userData['@type']);
            $this->assertIsString($userData['name']);
            $this->assertIsString($userData['email']);
            $this->assertIsString($userData['partner']);
            $this->assertIsString($userData['id']);
            $this->assertIsString($userData['lastLoggedIn']);
            $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/', $userData['lastLoggedIn']);
            $this->assertIsBool($userData['active']);
        }
    }

    public function testCreateUser(): void
    {
        $client = static::createClient();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner'])->getId();

        $payload = [
            'name' => 'Test User',
            'email' => 'test@user.com',
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $client->request('POST', '/api/users', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    public function testUpdateClient(): void
    {
        $client = static::createClient();

        $userRepository = $this->getContainer()->get(UserRepository::class);
        $userId = $userRepository->findOneBy(['name' => 'gpUser'])->getId();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test User',
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $response = $client->request('PATCH', '/api/users/'.$userId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);
        $content = json_decode($response->getContent(), true);
        $emailOfUser = $content['email'];

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(User::class);

        $payload = [
            'email' => 'test@user.com',
        ];

        $response = $client->request('PATCH', '/api/users/'.$userId, [
           'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);
        $content = json_decode($response->getContent(), true);

        $this->assertEquals($emailOfUser, $content['email'], 'The user email would not change.');
    }
}