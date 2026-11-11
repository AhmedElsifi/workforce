/// Base URL is overridable at build/run time:
///   flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000
///
/// 10.0.2.2 is the Android emulator's alias for the host machine's localhost.
/// A physical device needs the host machine's LAN IP instead. The default
/// points at the deployed backend used by the web client in production.
class AppConfig {
  AppConfig._();

  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://iti-project-workforce.vercel.app',
  );
}
