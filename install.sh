rm -rf maelstrom-users maelstrom-world maelstrom-web maelstrom-bot;
git clone https://github.com/demiurgosoft/maelstrom-users;
git clone https://github.com/demiurgosoft/maelstrom-world;
git clone https://github.com/demiurgosoft/maelstrom-web;
git clone https://github.com/demiurgosoft/maelstrom-bot;

cd maelstrom-users;
npm install;
cd ../maelstrom-world;
npm install;
cd ../maelstrom-bot;
npm install;
cd ../maelstrom-web;
npm install;
cd ..;
