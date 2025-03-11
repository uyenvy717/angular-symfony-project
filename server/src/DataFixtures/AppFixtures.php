<?php

namespace App\DataFixtures;

use App\Entity\AffiliatePartner;
use App\Entity\Client;
use App\Entity\GrowthPartner;
use App\Entity\SolutionPartner;
use App\Entity\SolutionProvider;
use App\Entity\User;
use Carbon\Carbon;
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
        $growthPartner = new GrowthPartner("growth", "abc@123", null, Carbon::now(), null);
        $manager->persist($growthPartner);
        $growthPartner2 = new GrowthPartner("growth2", "abc@456", null, Carbon::now(), null);
        $manager->persist($growthPartner2);

        $solutionPartner = new SolutionPartner("solutionPartner", "solution@partner", $growthPartner, null, Carbon::now(), null, null);
        $manager->persist($solutionPartner);
        $solutionPartner2 = new SolutionPartner("solutionPartner2", "solution2@partner", $growthPartner2, null, Carbon::now(), null, null);
        $manager->persist($solutionPartner2);
        $solutionProvider = new SolutionProvider("solutionProvider", "solution@provider", $growthPartner, null, Carbon::now(), null, null);
        $manager->persist($solutionProvider);
        $affiliatePartner = new AffiliatePartner("affiliatePartner", "affiliate@partner", $growthPartner2, null, Carbon::now(), null, null);
        $manager->persist($affiliatePartner);

        $client = new Client("gpClient", "gp@client", true, $growthPartner2, Carbon::now());
        $manager->persist($client);
        $client2 = new Client("spaClient", "spa@client", true, $solutionPartner, Carbon::now());
        $manager->persist($client2);
        $client3 = new Client("sprClient", "spr@client", true, $solutionProvider, Carbon::now());
        $manager->persist($client3);
        $client4 = new Client("aClient", "a@client", true, $affiliatePartner, Carbon::now());
        $manager->persist($client4);
        $client5 = new Client("spaClient2", "spa2@client", true, $solutionPartner2, Carbon::now());
        $manager->persist($client5);
        $client6 = new Client("spaClient3", "spa3@client", true, $solutionPartner2, Carbon::now());
        $manager->persist($client6);

        $user = new User("gpUser", "gp@user", $growthPartner);
        // Hash the password
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'testpassword');
        $user->setPassword($hashedPassword);
        $user->setRoles(['ROLE_ADMIN']);
        $manager->persist($user);

        $user2 = new User("spaUser", "spa@user", $solutionPartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user2, 'testpassword2');
        $user2->setPassword($hashedPassword);
        $user2->setRoles(['ROLE_ADMIN']);
        $manager->persist($user2);

        $user3 = new User("sprUser", "spr@user", $solutionProvider);
        $hashedPassword = $this->passwordHasher->hashPassword($user3, 'testpassword3');
        $user3->setPassword($hashedPassword);
        $user3->setRoles(['ROLE_ADMIN']);
        $manager->persist($user3);

        $user4 = new User("gpUser2", "gp2@user", $growthPartner2);
        // Hash the password
        $hashedPassword = $this->passwordHasher->hashPassword($user4, 'testpassword');
        $user4->setPassword($hashedPassword);
        $user4->setRoles(['ROLE_ADMIN']);
        $manager->persist($user4);

        $user5 = new User("spaUser2", "spa2@user", $solutionPartner2);
        $hashedPassword = $this->passwordHasher->hashPassword($user5, 'testpassword2');
        $user5->setPassword($hashedPassword);
        $user5->setRoles(['ROLE_ADMIN']);
        $manager->persist($user5);

        $user6 = new User("aUser", "a@user", $affiliatePartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user6, 'testpassword2');
        $user6->setPassword($hashedPassword);
        $user6->setRoles(['ROLE_ADMIN']);
        $manager->persist($user6);

        $user7 = new User("admin", "admin@user", $growthPartner);
        $hashedPassword = $this->passwordHasher->hashPassword($user7, 'testpassword');
        $user7->setPassword($hashedPassword);
        $user7->setRoles(['ROLE_SUPER_ADMIN']);
        $manager->persist($user7);

        $user8 = new User("sprUser2", "spr2@user", $solutionProvider);
        $hashedPassword = $this->passwordHasher->hashPassword($user8, 'testpassword3');
        $user8->setPassword($hashedPassword);
        $user8->setRoles(['ROLE_USER']);
        $manager->persist($user8);

        $manager->flush();
    }
}
