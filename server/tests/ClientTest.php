<?php

namespace App\Tests;

use App\Entity\Client;
use App\Repository\ClientRepository;
use App\Repository\PartnerRepository;
use Carbon\CarbonImmutable;

class ClientTest extends AbstractTest
{
    private array $body = [
        'email' => 'admin@user',
        'password' => 'testpassword',
    ];

    // Growth partner can get clients in scope
    public function testGetClients(): void
    {
        $this->createClientWithCredentials()->request('GET', '/api/clients');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/Client',
            '@id' => '/api/clients',
            '@type' => 'Collection',
            'totalItems' => 2
        ]);

        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }

    // Top-level account can get all clients
    public function testGetAllClients(): void
    {
        $this->createClientWithCredentials(null, $this->body)->request('GET', '/api/clients');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/Client',
            '@id' => '/api/clients',
            '@type' => 'Collection',
            'totalItems' => 6
        ]);

        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }

    // Growth partner can create client in scope
    public function testCreateClient(): void
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'email' => 'test@client.com',
            'startDate' => null,
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        // Test with null startDate
        $response = $this->createClientWithCredentials()->request('POST', '/api/clients', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('startDate', $content);

        $this->assertEquals(
            CarbonImmutable::today(),
            CarbonImmutable::parse($content['startDate']),
            'The startDate should be set to today’s date when null is provided.'
        );

        // Test with provided startDate
        $customDate = '2025-03-01T00:00:00+00:00';
        $payload['startDate'] = $customDate;

        $response = $this->createClientWithCredentials()->request('POST', '/api/clients', [
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

        // Cannot update client out of the scope
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner2'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'email' => 'test@client.com',
            'startDate' => null,
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $this->createClientWithCredentials()->request('POST', '/api/clients', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertJsonContains([
            'title' => 'An error occurred',
            'description' => 'Access Denied.'
        ]);
        $this->assertResponseStatusCodeSame(403);
    }

    // Top-level account can create any client
    public function testCreateAnyClient(): void
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner2'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'email' => 'test@client.com',
            'startDate' => null,
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        // Test with null startDate
        $response = $this->createClientWithCredentials(null, $this->body)->request('POST', '/api/clients', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }

    // Growth partner can update client's information in scope
    public function testUpdateClient(): void
    {
        $clientRepository = $this->getContainer()->get(ClientRepository::class);
        $clientId = $clientRepository->findOneBy(['name' => 'sprClient'])->getId();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client',
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $response = $this->createClientWithCredentials()->request('PATCH', '/api/clients/'.$clientId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(Client::class);

        // Cannot update partner via this API
        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('partner', $content);
        $this->assertNotEquals('/api/solution_partners/'.$partnerId, $content['partner']);

        // Cannot update partner out of scope
        $clientId = $clientRepository->findOneBy(['name' => 'spaClient2'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client'
        ];

        $this->createClientWithCredentials()->request('PATCH', '/api/clients/'.$clientId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertJsonContains([
            'title' => 'An error occurred',
            'description' => 'Access Denied.'
        ]);
        $this->assertResponseStatusCodeSame(403);
    }

    // Top-level account can update any client
    public function testUpdateAnyClient(): void
    {
        $clientRepository = $this->getContainer()->get(ClientRepository::class);
        $clientId = $clientRepository->findOneBy(['name' => 'spaClient2'])->getId();

        $payload = [
            'isActive' => true,
            'name' => 'Test Client'
        ];

        $this->createClientWithCredentials(null, $this->body)->request('PATCH', '/api/clients/'.$clientId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertMatchesResourceItemJsonSchema(Client::class);
    }

    // Growth partner re-assign client's partner in scope
    public function testUpdateRegisteredPartner(): void
    {
        $clientRepository = $this->getContainer()->get(ClientRepository::class);
        $clientId = $clientRepository->findOneBy(['name' => 'sprClient'])->getId();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner'])->getId();

        $payload = [
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $response = $this->createClientWithCredentials()->request('PATCH', '/api/clients/'.$clientId.'/registeredPartner', [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(Client::class);

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('partner', $content);
        $this->assertEquals('/api/solution_partners/'.$partnerId, $content['partner']);

        // Growth partner cannot re-assign client's partner out of scope
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner2'])->getId();

        $payload = [
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $this->createClientWithCredentials()->request('PATCH', '/api/clients/'.$clientId.'/registeredPartner', [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertJsonContains([
            'title' => 'An error occurred',
            'description' => 'Access Denied.'
        ]);
        $this->assertResponseStatusCodeSame(403);
    }

    // Top-level account can re-assign any client to any partner
    public function testUpdateAnyRegisteredPartner(): void
    {
        $clientRepository = $this->getContainer()->get(ClientRepository::class);
        $clientId = $clientRepository->findOneBy(['name' => 'sprClient'])->getId();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionPartner2'])->getId();

        $payload = [
            'partner' => '/api/solution_partners/'.$partnerId,
        ];

        $response = $this->createClientWithCredentials(null, $this->body)->request('PATCH', '/api/clients/'.$clientId.'/registeredPartner', [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(Client::class);

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('partner', $content);
        $this->assertEquals('/api/solution_partners/'.$partnerId, $content['partner']);
    }
}