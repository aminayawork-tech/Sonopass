import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = SonoPassViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

// The web pages scroll inside the page itself, so the web view's own scroll view must stay at the
// top. iOS could otherwise leave it shifted up by the status-bar height (cutting off the header) with
// no way to swipe it back. Scroll bars are hidden; scrolling inside the page still works.
class SonoPassViewController: CAPBridgeViewController {
    private var offsetObservation: NSKeyValueObservation?
    private var keyboardVisible = false

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        guard let scrollView = webView?.scrollView else { return }
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.bounces = false
        scrollView.contentInsetAdjustmentBehavior = .never

        // While the keyboard is up, iOS may move the view to keep the text field visible; allow that,
        // then put it back once the keyboard is gone.
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardDidHide), name: UIResponder.keyboardDidHideNotification, object: nil)

        offsetObservation = scrollView.observe(\.contentOffset, options: [.new]) { [weak self] view, _ in
            guard let self = self, !self.keyboardVisible else { return }
            if view.contentOffset != .zero {
                view.setContentOffset(.zero, animated: false)
            }
        }
    }

    @objc private func keyboardWillShow() {
        keyboardVisible = true
    }

    @objc private func keyboardDidHide() {
        keyboardVisible = false
        webView?.scrollView.setContentOffset(.zero, animated: false)
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
