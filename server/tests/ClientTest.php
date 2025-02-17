<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\AppFixtures;
use App\Entity\Client;
use App\Repository\ClientRepository;
use App\Repository\PartnerRepository;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;

class ClientTest extends ApiTestCase
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

    public function testGetClients(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/clients');
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/Client',
            '@id' => '/api/clients',
            '@type' => 'Collection',
            'totalItems' => 6
        ]);

        $responseArray = $client->getResponse()->toArray();

        // Ensure the 'member' key exists and is an array
        $this->assertArrayHasKey('member', $responseArray);
        $this->assertIsArray($responseArray['member']);

        foreach ($responseArray['member'] as $clientData) {
            // Check required keys
            $expectedKeys = ['@id', '@type', 'name', 'email', 'startDate', 'partner', 'active'];
            foreach ($expectedKeys as $key) {
                $this->assertArrayHasKey($key, $clientData);
            }

            // Validate data types
            $this->assertIsString($clientData['@id']);
            $this->assertIsString($clientData['@type']);
            $this->assertIsString($clientData['name']);
            $this->assertIsString($clientData['email']);
            $this->assertIsString($clientData['partner']);
            $this->assertIsString($clientData['startDate']);
            $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/', $clientData['startDate']);
            $this->assertIsBool($clientData['active']);
        }
    }

    public function testCreateClient(): void
    {
        $client = static::createClient();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'growth'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'email' => 'test@client.com',
            'startDate' => null,
            'partner' => '/api/growth_partners/'.$partnerId,
        ];

        // Test with null startDate
        $response = $client->request('POST', '/api/clients', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('startDate', $content);
        $this->assertMatchesRegularExpression(
            '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/',
            $content['startDate']
        );

        $this->assertEquals(
            (new \DateTime())->format('Y-m-d'),
            (new \DateTime($content['startDate']))->format('Y-m-d'),
            'The startDate should be set to today’s date when null is provided.'
        );

        // Test with provided startDate
        $customDate = '2025-03-01T00:00:00+00:00';
        $payload['startDate'] = $customDate;

        $response = $client->request('POST', '/api/clients', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $content = json_decode($response->getContent(), true);

        // Assert startDate matches provided value
        $this->assertEquals(
            $customDate,
            $content['startDate'],
            'The startDate should match the provided value.'
        );

        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }

    public function testUpdateClient(): void
    {
        $client = static::createClient();

        $clientRepository = $this->getContainer()->get(ClientRepository::class);
        $clientId = $clientRepository->findOneBy(['name' => 'gpClient'])->getId();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'growth'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'partner' => '/api/growth_partners/'.$partnerId,
        ];

        $client->request('PATCH', '/api/clients/'.$clientId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }
}