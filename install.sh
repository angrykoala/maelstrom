rm -rf maelstrom-users maelstrom-world;
git clone https://github.com/demiurgosoft/maelstrom-users;
git clone https://github.com/demiurgosoft/maelstrom-world;

cd maelstrom-users;
npm install;
cd ../maelstrom-world;
npm install;
cd ..;
