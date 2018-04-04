# rocketchat-export-userlist

Simple Node CLI tool to export a complete user list of a [Rocket.Chat](https://rocket.chat/) server as CSV (comma-separated values) file.

![](https://i.imgur.com/SpImzqB.png)

![](https://i.imgur.com/jr0QShl.png)

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:

    ```shell
    git clone https://github.com/frdmn/rocketchat-export-userlist
    ```

3. Copy and adjust configuration file from sample:

    ```shell
    cp config.sample.json config.json
    vi config.json
    ```

Make sure it contains proper user (with administration access) credentials

3. Install the project dependencies:

    ```shell
    npm install
    ```

## Usage

Here's a short explanation how to use `rocketchat-export-userlist`:

* Run `export-userlist.js`:

    ```shell
    node export-userlist.js
    ```

## Contributing

1. Fork it
2. Create your feature branch:

    ```shell
    git checkout -b feature/my-new-feature
    ```

3. Commit your changes:

    ```shell
    git commit -am 'Add some feature'
    ```

4. Push to the branch:

    ```shell
    git push origin feature/my-new-feature
    ```

5. Submit a pull request

## Requirements / Dependencies

* NodeJS

## Version

1.0.0

## License

[MIT](LICENSE)
