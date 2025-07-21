<?php

namespace App\DataFixtures;

use App\Entity\AffiliatePartner;
use App\Entity\Client;
use App\Entity\GrowthPartner;
use App\Entity\SolutionPartner;
use App\Entity\SolutionProvider;
use App\Entity\User;
use Carbon\CarbonImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $growthPartner = new GrowthPartner("Mochadocs", "abc@123", null, CarbonImmutable::now(), null);
        $manager->persist($growthPartner);
        $growthPartner2 = new GrowthPartner("Nordics/Baltics", "abc@456", null, CarbonImmutable::now(), null);
        $manager->persist($growthPartner2);

        $solutionPartner = new SolutionPartner("SolutionPartner", "solution@partner", $growthPartner, null, CarbonImmutable::now(), null, null);
        $manager->persist($solutionPartner);
        $solutionPartner2 = new SolutionPartner("SolutionPartner2", "solution2@partner", $growthPartner2, null, CarbonImmutable::now(), null, null);
        $manager->persist($solutionPartner2);
        $solutionProvider = new SolutionProvider("SolutionProvider", "solution@provider", $growthPartner, null, CarbonImmutable::now(), null, null);
        $manager->persist($solutionProvider);
        $affiliatePartner = new AffiliatePartner("AffiliatePartner", "affiliate@partner", $growthPartner2, null, CarbonImmutable::now(), null, null);
        $manager->persist($affiliatePartner);

        $client = new Client("NBClient", "gp@client", true, $growthPartner2, CarbonImmutable::now());
        $manager->persist($client);
        $client2 = new Client("SparClient", "spa@client", true, $solutionPartner, CarbonImmutable::now());
        $manager->persist($client2);
        $client3 = new Client("SprovClient", "spr@client", true, $solutionProvider, CarbonImmutable::now());
        $manager->persist($client3);
        $client4 = new Client("AfflClient", "a@client", true, $affiliatePartner, CarbonImmutable::now());
        $manager->persist($client4);
        $client5 = new Client("Spar2Client", "spa2@client", true, $solutionPartner2, CarbonImmutable::now());
        $manager->persist($client5);
        $client6 = new Client("ClientOfSpar2", "spa3@client", true, $solutionPartner2, CarbonImmutable::now());
        $manager->persist($client6);

        $user = new User("MochadocsUser", "gp@user", $growthPartner);
        // Hash the password
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'testpassword');
        $user->setPassword($hashedPassword);
        $user->setRoles(['ROLE_ADMIN']);
        $manager->persist($user);

        $user2 = new User("SparUser", "spa@user", $solutionPartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user2, 'testpassword');
        $user2->setPassword($hashedPassword);
        $user2->setRoles(['ROLE_ADMIN']);
        $manager->persist($user2);

        $user3 = new User("SprovUser", "spr@user", $solutionProvider);
        $hashedPassword = $this->passwordHasher->hashPassword($user3, 'testpassword');
        $user3->setPassword($hashedPassword);
        $user3->setRoles(['ROLE_ADMIN']);
        $manager->persist($user3);

        $user4 = new User("NBUser", "gp2@user", $growthPartner2);
        // Hash the password
        $hashedPassword = $this->passwordHasher->hashPassword($user4, 'testpassword');
        $user4->setPassword($hashedPassword);
        $user4->setRoles(['ROLE_ADMIN']);
        $manager->persist($user4);

        $user5 = new User("Spar2User", "spa2@user", $solutionPartner2);
        $hashedPassword = $this->passwordHasher->hashPassword($user5, 'testpassword');
        $user5->setPassword($hashedPassword);
        $user5->setRoles(['ROLE_ADMIN']);
        $manager->persist($user5);

        $user6 = new User("AfflUser", "a@user", $affiliatePartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user6, 'testpassword');
        $user6->setPassword($hashedPassword);
        $user6->setRoles(['ROLE_ADMIN']);
        $manager->persist($user6);

        $user7 = new User("Huib", "admin@user", $growthPartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user7, 'testpassword');
        $user7->setPassword($hashedPassword);
        $user7->setRoles(['ROLE_SUPER_ADMIN']);
        $manager->persist($user7);

        $user8 = new User("UserOfSprov", "spr2@user", $solutionProvider);
        $hashedPassword = $this->passwordHasher->hashPassword($user8, 'testpassword');
        $user8->setPassword($hashedPassword);
        $user8->setRoles(['ROLE_USER']);
        $manager->persist($user8);

        $manager->flush();
    }
}
