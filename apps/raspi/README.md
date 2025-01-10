## Añade los siguientes repositorios
echo "deb https://seeed-studio.github.io/pi_repo/ stretch main" | sudo tee -a /etc/apt/sources.list
echo "deb http://raspbian.raspberrypi.org/raspbian/ buster main contrib non-free rpi" | sudo tee -a /etc/apt/sources.list
echo "deb https://seeed-studio.github.io/pi_repo/ stretch main" | sudo tee /etc/apt/sources.list.d/seeed.list
curl https://seeed-studio.github.io/pi_repo/public.key | sudo apt-key add -

## Instala las dependencias
sudo apt install -y python3-mraa python3-upm libbmi088 libbma456 virtualenv

## Crea un entorno virtual
virtualenv -p python3 env

## Instala más dependencias
pip3 install -r requirements.txt
