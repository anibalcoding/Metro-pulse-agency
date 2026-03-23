<?php
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Sanitize helper
function clean($str) {
    return htmlspecialchars(strip_tags(trim($str)));
}

// Collect & sanitize fields
$fname    = clean($_POST['fname']    ?? '');
$lname    = clean($_POST['lname']    ?? '');
$email    = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$business = clean($_POST['business'] ?? '');
$industry = clean($_POST['industry'] ?? '');
$package  = clean($_POST['package']  ?? '');
$hosting  = clean($_POST['hosting']  ?? '');
$message  = clean($_POST['message']  ?? '');

// Validate required fields
if (empty($fname) || empty($lname)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your full name.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}
if (empty($package)) {
    echo json_encode(['success' => false, 'message' => 'Please select a website package.']);
    exit;
}
if (empty($hosting)) {
    echo json_encode(['success' => false, 'message' => 'Please select a monthly plan.']);
    exit;
}

// ── UPDATE THIS to your real email ──────────────────────────────
$owner_email   = 'Contact@metropulseagency.com';
$from_address  = 'Contact@metropulseagency.com';
// ────────────────────────────────────────────────────────────────

// ── Email to you (the owner) ─────────────────────────────────────
$subject = "New Lead: {$fname} {$lname} — Metro Pulse";

$body  = "You have a new booking request from your website.\n\n";
$body .= "────────────────────────────\n";
$body .= "Name:          {$fname} {$lname}\n";
$body .= "Email:         {$email}\n";
$body .= "Business:      {$business}\n";
$body .= "Industry:      {$industry}\n";
$body .= "Package:       {$package}\n";
$body .= "Monthly Plan:  {$hosting}\n";
$body .= "────────────────────────────\n";
$body .= "Message:\n{$message}\n";

$headers  = "From: Metro Pulse Website <{$from_address}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($owner_email, $subject, $body, $headers);

if (!$sent) {
    echo json_encode(['success' => false, 'message' => 'Something went wrong. Please try again or email us directly.']);
    exit;
}

// ── Confirmation email to the customer ───────────────────────────
$confirm_subject = "Got your request — we'll be in touch soon.";

$confirm_body  = "Hey {$fname},\n\n";
$confirm_body .= "Thanks for reaching out to Metro Pulse Agency!\n\n";
$confirm_body .= "We received your request and will be in touch within 24 hours to lock in your free call.\n\n";
$confirm_body .= "Here's what you submitted:\n";
$confirm_body .= "  Package:      {$package}\n";
$confirm_body .= "  Monthly Plan: {$hosting}\n\n";
$confirm_body .= "Come ready to talk about your business — we'll handle the rest.\n\n";
$confirm_body .= "— Metro Pulse Agency\n";
$confirm_body .= "hello@metropulseagency.com";

$confirm_headers  = "From: Metro Pulse Agency <{$owner_email}>\r\n";
$confirm_headers .= "X-Mailer: PHP/" . phpversion();

mail($email, $confirm_subject, $confirm_body, $confirm_headers);

echo json_encode(['success' => true]);
