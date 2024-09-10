module todolist_addr::todolist {
  use aptos_framework::event;
  use aptos_framework::account;
  use std::string::String;
  use std::signer;
  use aptos_std::table::{Self, Table};
  #[test_only]
  use std::string;

  // Errors
  /// User has not created a todo list
  const E_TODO_LIST_DOES_NOT_EXIST: u64 = 1;

  /// Each user can only have one todo list
  const E_EACH_USER_CAN_ONLY_HAVE_ONE_TODO_LIST: u64 = 2;

  /// Task with this ID does not exist
  const E_TODO_DOES_NOT_EXIST: u64 = 3;

  /// Task has already been completed
  const E_TODO_ALREADY_COMPLETED: u64 = 4;

  struct TodoList has key {
    tasks: Table<u64, Task>,
    set_task_event: event::EventHandle<Task>,
    task_counter: u64
  }

  struct Task has store, drop, copy {
    task_id: u64,
    address: address,
    content: String,
    completed: bool,
  }

  public entry fun create_list(account: &signer) {
    let sender_address = signer::address_of(account);
    assert!(
      !exists<TodoList>(sender_address),
      E_EACH_USER_CAN_ONLY_HAVE_ONE_TODO_LIST
    );
    let tasks_holder = TodoList {
      tasks: table::new(),
      set_task_event: account::new_event_handle<Task>(account),
      task_counter: 0
    };
    // move the TodoList resource under the signer account
    move_to(account, tasks_holder);
  }

  public entry fun create_task(account: &signer, content: String) acquires TodoList {
    let signer_address = signer::address_of(account);
    assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOES_NOT_EXIST);

    let user_todo_list = borrow_global_mut<TodoList>(signer_address);
    let counter = user_todo_list.task_counter + 1;
    let new_task = Task {
      task_id: counter,
      address: signer_address,
      content,
      completed: false
    };
    table::upsert(&mut user_todo_list.tasks, counter, new_task);
    user_todo_list.task_counter = counter;
    event::emit_event<Task>(
      &mut borrow_global_mut<TodoList>(signer_address).set_task_event,
      new_task,
    );
  }

  public entry fun complete_task(account: &signer, task_id: u64) acquires TodoList {
    let signer_address = signer::address_of(account);
    assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOES_NOT_EXIST);

    let todo_list = borrow_global_mut<TodoList>(signer_address);
    assert!(table::contains(&todo_list.tasks, task_id), E_TODO_DOES_NOT_EXIST);
    let task_record = table::borrow_mut(&mut todo_list.tasks, task_id);
    assert!(task_record.completed == false, E_TODO_ALREADY_COMPLETED);
    task_record.completed = true;
  }

  public entry fun delete_task(account: &signer, task_id: u64) acquires TodoList {
    let signer_address = signer::address_of(account);
    assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOES_NOT_EXIST);

    let todo_list = borrow_global_mut<TodoList>(signer_address);
    assert!(table::contains(&todo_list.tasks, task_id), E_TODO_DOES_NOT_EXIST);

    // Remove the task from the table
    table::remove(&mut todo_list.tasks, task_id);
  }

  // ======================== Read Functions ========================
  #[view]
  public fun has_todo_list(sender: address): bool {
    exists<TodoList>(sender)
  }

  #[view]
  public fun get_todo(sender: address, task_id: u64): (String, bool) acquires TodoList {
    assert_user_has_todo_list(sender);
    let todo_list = borrow_global<TodoList>(sender);
    assert!(table::contains(&todo_list.tasks, task_id), E_TODO_DOES_NOT_EXIST);
    let task_record = table::borrow(&todo_list.tasks, task_id);
    (task_record.content, task_record.completed)
  }

  // ======================== Helper Functions ========================
  fun assert_user_has_todo_list(user_addr: address) {
    assert!(
      exists<TodoList>(user_addr),
      E_TODO_LIST_DOES_NOT_EXIST
    );
  }

  // #[test(admin = @0x123)]
  // public entry fun test_flow(admin: signer) acquires TodoList {
  //   account::create_account_for_test(signer::address_of(&admin));
  //   create_list(&admin);

  //   create_task(&admin, string::utf8(b"New Task"));
  //   let task_count = event::counter(&borrow_global<TodoList>(signer::address_of(&admin)).set_task_event);
  //   assert!(task_count == 1, 4);
  //   let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
  //   assert!(todo_list.task_counter == 1, 5);
  //   let task_record = table::borrow(&todo_list.tasks, todo_list.task_counter);
  //   assert!(task_record.task_id == 1, 6);
  //   assert!(task_record.completed == false, 7);
  //   assert!(task_record.content == string::utf8(b"New Task"), 8);
  //   assert!(task_record.address == signer::address_of(&admin), 9);

  //   complete_task(&admin, 1);
  //   let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
  //   let task_record = table::borrow(&todo_list.tasks, 1);
  //   assert!(task_record.task_id == 1, 10);
  //   assert!(task_record.completed == true, 11);
  //   assert!(task_record.content == string::utf8(b"New Task"), 12);
  //   assert!(task_record.address == signer::address_of(&admin), 13);

  //   // Deleting the task
  //   delete_task(&admin, 1);
  //   assert!(!table::contains(&todo_list.tasks, 1), 14);
  // }

  #[test(admin = @0x123)]
  public entry fun test_flow(admin: signer) acquires TodoList {
    // creates an admin @todolist_addr account for test
    account::create_account_for_test(signer::address_of(&admin));
    // initialize contract with admin account
    create_list(&admin);

    // creates a task by the admin account
    create_task(&admin, string::utf8(b"New Task"));
    let task_count = event::counter(&borrow_global<TodoList>(signer::address_of(&admin)).set_task_event);
    assert!(task_count == 1, 4);
    let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
    assert!(todo_list.task_counter == 1, 5);
    let task_record = table::borrow(&todo_list.tasks, todo_list.task_counter);
    assert!(task_record.task_id == 1, 6);
    assert!(task_record.completed == false, 7);
    assert!(task_record.content == string::utf8(b"New Task"), 8);
    assert!(task_record.address == signer::address_of(&admin), 9);

    // updates task as completed
    complete_task(&admin, 1);
    let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
    let task_record = table::borrow(&todo_list.tasks, 1);
    assert!(task_record.task_id == 1, 10);
    assert!(task_record.completed == true, 11);
    assert!(task_record.content == string::utf8(b"New Task"), 12);
    assert!(task_record.address == signer::address_of(&admin), 13);
  }

  #[test(admin = @0x123)]
  #[expected_failure(abort_code = E_TODO_LIST_DOES_NOT_EXIST)]
  public entry fun account_can_not_update_task(admin: signer) acquires TodoList {
    // creates an admin @todolist_addr account for test
    account::create_account_for_test(signer::address_of(&admin));
    // account can not toggle task as no list was created
    complete_task(&admin, 2);
  }

  #[test(admin = @0x132)]
  public entry fun test_complete_task(admin: signer) acquires TodoList {
    // creates an admin @todolist_addr account for test
    account::create_account_for_test(signer::address_of(&admin));
    // initialize contract with admin account
    create_list(&admin);
    create_task(&admin, string::utf8(b"Test Task"));
    
    complete_task(&admin, 1);
    
    let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
    let task_record = table::borrow(&todo_list.tasks, 1);
    assert!(task_record.completed == true, 11);
  }

  #[test(admin = @0x123)]
  public entry fun test_delete_task(admin: signer) acquires TodoList {
    account::create_account_for_test(signer::address_of(&admin));
    create_list(&admin);
    create_task(&admin, string::utf8(b"Test Task"));

    delete_task(&admin, 1);
    
    let todo_list = borrow_global<TodoList>(signer::address_of(&admin));
    assert!(!table::contains(&todo_list.tasks, 1), 15);
  }
}
