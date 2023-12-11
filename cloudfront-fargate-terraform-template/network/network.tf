resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/24"
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
}


#region: Public subnet

resource "aws_subnet" "public-1a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.0.0/27"
  availability_zone = "ap-northeast-1a"
  tags = {
    "Name" = "public-1a"
  }
}

resource "aws_subnet" "public-1c" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.0.32/27"
  availability_zone = "ap-northeast-1c"
  tags = {
    "Name" = "public-1c"
  }
}

resource "aws_route_table" "for-public" {
  vpc_id = aws_vpc.vpc.id
  route {
    gateway_id = aws_internet_gateway.igw.id
    cidr_block = "0.0.0.0/0"
  }
  tags = {
    "Name" = "for-public"
  }
}

resource "aws_route_table_association" "for-public-1a" {
  subnet_id      = aws_subnet.public-1a.id
  route_table_id = aws_route_table.for-public.id
}

resource "aws_route_table_association" "for-public-1c" {
  subnet_id      = aws_subnet.public-1c.id
  route_table_id = aws_route_table.for-public.id
}

#endregion: Public subnet

resource "aws_subnet" "private-1a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.0.64/27"
  availability_zone = "ap-northeast-1a"
  tags = {
    "Name" = "private-1a"
  }
}

resource "aws_eip" "in-public-1a" {
  domain = "vpc"
  tags = {
    "Name" = "in-public-1a"
  }
}

resource "aws_nat_gateway" "in-public-1a" {
  allocation_id = aws_eip.in-public-1a.id
  subnet_id     = aws_subnet.public-1a.id
  depends_on    = [aws_internet_gateway.igw]
  tags = {
    "Name" = "in-public-1a"
  }
}

resource "aws_route_table" "for-private-1a" {
  vpc_id = aws_vpc.vpc.id
  route {
    nat_gateway_id = aws_nat_gateway.in-public-1a.id
    cidr_block     = "0.0.0.0/0"
  }
  tags = {
    "Name" = "for-private-1a"
  }
}

resource "aws_route_table_association" "for-private-1a" {
  subnet_id      = aws_subnet.private-1a.id
  route_table_id = aws_route_table.for-private-1a.id
}

resource "aws_subnet" "private-1c" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.0.96/27"
  tags = {
    "Name" = "private-1c"
  }
}

resource "aws_eip" "in-public-1c" {
  domain = "vpc"
  tags = {
    "Name" = "in-public-1c"
  }
}

resource "aws_nat_gateway" "in-public-1c" {
  allocation_id = aws_eip.in-public-1c.id
  subnet_id     = aws_subnet.public-1c.id
  depends_on    = [aws_internet_gateway.igw]
  tags = {
    "Name" = "in-public-1c"
  }
}

resource "aws_route_table" "for-private-1c" {
  vpc_id = aws_vpc.vpc.id
  route {
    nat_gateway_id = aws_nat_gateway.in-public-1c.id
    cidr_block     = "0.0.0.0/0"
  }
  tags = {
    "Name" = "for-private-1c"
  }
}

resource "aws_route_table_association" "for-private-1c" {
  subnet_id      = aws_subnet.private-1c.id
  route_table_id = aws_route_table.for-private-1c.id
}
