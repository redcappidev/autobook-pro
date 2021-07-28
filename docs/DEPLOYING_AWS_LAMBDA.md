# Table Contents

1. [AWS Resource Configuration](#aws-resource-configuration)
   1. [Certificate](#certificate)
   2. [S3](#s3)
   3. [VPC](#vpc)
   4. [RDS](#rds)
   5. [Systems Manager](#systems-manager)
2. [Third Party Configuration](#third-party-configuration)
3. [Deploy with Github Workflow](#deploy-with-github-workflow)

# AWS Resource Configuration

Walking through all the different AWS resources and configuration that must be in place before deploying Autobook Pro.

## Certificate

Autobook Pro needs a domain to run on. We're deploying to AWS Lambda that is publically faced via API Gateway. Using AWS API Gateway results in odd hostnames for the endpoint. Further, these hostnames will change if you remove and redeploy your service, which can cause problems for existing clients.
In order to configure the API Gateway with this domain we first need to create a certificate.

Waiting for verification for a certificate may take a while so we will start that now.

To Set up the certificate:

1. First, make sure you have the domain name in your [Registered Domains](https://console.aws.amazon.com/route53/home?#DomainListing:) in Route 53.

- If you have a domain that's registered with a different registrar, you can [transfer registration to Route 53](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html).
- If you don't have a domain yet, you can purchase one through Route 53.

2. Go to the Certificate Manager service. [Request a certificate](https://console.aws.amazon.com/acm/home?region=us-east-1#/wizard/).
   Note that you'll need to be in region us-east-1. This is the only region that works with API Gateway.
3. Select "public."
4. Add a domain name `*.autobookpro.com`, `autobookpro.com`.
5. Choose a validation method (generally the DNS method). Add the verification DNS records to your domain. Wait for the DNS update to propogate and continue with the setup.

## S3

To deploy the frontend, we used Webpack to build the client-side bundle and deployed that to a S3 bucket.
The Autobook Pro backend would render the HTML for the page, with a script tag pointing to the bundle.

To Set up a S3 bucket for Autobook Pro CRM:

1. Create a private S3 bucket by choosing all the default values as you go throuh the setup wizard.
2. Turn off Block all public access because we're granting public read access to some objects for the frontend assets in the bucket.
3. Enable CORS
   ```
    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>https://app.autobookpro.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
    </CORSRule>
    <CORSRule>
        <AllowedOrigin>https://beta.autobookpro.com</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
    </CORSRule>
    </CORSConfiguration>
   ```

## VPC

We will create a VPC with two groups of subnets, one publicly accessible one for the RDS instance and one private one for our AWS Lambda function (don't worry, the API Gateway created later will expose the function via the domain you created a certificate for). Each group will have two subnets for redundancy.

To set up a VPC:

1. [Launch VPC Wizard](https://console.aws.amazon.com/vpc/home?region=us-east-1#wizardSelector:)
2. Choose `VPC with a Single Public Subnet`.
3. Give the VPC a name. `Autobook Pro VPC`
4. Give the public subnet a name. `Autobook Pro Public - 1`
5. Create VPC

### Subnets

One subnet was already created for us. We will create one more public subnet and two private subnets.
It is important that the private subnets are in different availability regions from each other, but they do not need to be different from the public subnets.

To set up subnets

1. [Launch Subnet Wizard](https://console.aws.amazon.com/vpc/home?region=us-east-1#CreateSubnet:)
2. Give it a name.

- `Autobook Pro Public - 2`
- `Autobook Pro Private - 1`
- `Autobook Pro Private - 2`

3. Select a VPC that we just created
4. Set IPv4 CIDR block to `10.0.1.0/24` for a public subnet, `10.0.2.0/24`, `10.0.3.0/24` for each private subnet.

The subnets are private ones by default. To make `10.0.1.0/24` CIDR block be public:

1. Select the subnet and Edit route table association in Route Table tab.
2. Select the public route table.

### NAT Gateway

A NAT Gateway is required to allow the private AWS Lambda function to talk to the outside world (Google Maps API, SendGrid, etc.).

Create a NAT Gateway in one of the two **public** subnets. Create a new Elastic IP address to use with it using the provided button.

### Route Tables

You should have two route tables for your Autobook Pro VPC at this point. Give the name `Autobook Pro - Private` the one marked Main and `Autobook Pro - Public` to the other one.

Double check that `Autobook Pro - Public`'s routes are configured to use the internet gateway created with the VPC:

```
| Destination | Target            |
|-------------|-------------------|
| 10.0.0.0/16 | local             |
| 0.0.0.0/0   | igw-xxxxxxxxxxxxx |
```

Then, edit `Autobook Pro - Private`'s routes to connect to the NAT you just created:

```
| Destination | Target            |
|-------------|-------------------|
| 10.0.0.0/16 | local             |
| 0.0.0.0/0   | nat-xxxxxxxxxxxxx |
```

### Security Groups

Security groups give you fine grained access control for resources.

We will create 3 security groups for Lambda, RDS.

1. Create a security group called `Autobook Pro - Lambda` and description `Security group for Lambda function access`. Copy the security group ID `sg-xxxxx` of this new group. Edit the inbound rules to allow web access:

   ```
   | Type        | Protocol | Port Range | Source   | Description           |
   |-------------|----------|------------|----------|-----------------------|
   | HTTP (80)   | TCP (6)  | 80         | sg-xxxxx | Web traffic           |
   | HTTPS (443) | TCP (6)  | 443        | sg-xxxxx | Encrypted web traffic |
   ```

2. Create another security group called `Autobook Pro - RDS` and description `Security group for RDS access`. Edit the inbound rules to allow web access:

   ```
   | Type              | Protocol | Port Range | Source    | Description           |
   |-------------------|----------|------------|-----------|-----------------------|
   | PostgreSQL (5432) | TCP (6)  | 5432       | 0.0.0.0/0 | Allow all DB access   |
   ```

## RDS

```
@ToDo
```

## Systems Manager

### Parameter Store.

We will use AWS Systems Manager Parameter Store as a secure, hierachical storage for configuration data management and secrets management.

| Parameter Name                      | Parameter Type | Parameter Value (sample)         | ENV VAR            |
| ----------------------------------- | -------------- | -------------------------------- | ------------------ |
| /autobook-pro/assets-bucket-arn     | String         | arn:aws:s3:::app.autobookpro.com |                    |
| /autobook-pro/assets-bucket-name    | String         | app.autobookpro.com              | AWS_S3_BUCKET_NAME |
| /autobook-pro/lambda-security-group | SecureString   | sg-xxxxxx                        |                    |
| /autobook-pro/subnet-private-1      | SecureString   | subnet-xxxxx                     |
| /autobook-pro/subnet-private-2      | SecureString   | subnet-xxxxx                     |                    |

# Third Party Configuration

# Deploy with Github Workflow

## IAM account

Create an IAM account with `AdministratorAccess` policy and take note of the access key and secret key.

Add the keys to your Github as repository-level secrets.

## Workflow Scripts

The workflow script for the development and production environments are in `.github/workflows`.
